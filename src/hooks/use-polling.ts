import {useCallback, useEffect, useRef, useState} from 'react';
import {Alert} from 'react-native';
import {
  getPoll,
  getPolling,
  getPollingRoundLock,
  postPolling,
  postPollingRefresh,
  postPollingRound,
  postPollingVote,
} from '../libs/api/poll';
import {configs} from '../libs/common/configs';
import {
  POLLING_ERROR_ALREADY_DONE,
  POLLING_ERROR_EXCEED_REFRESH,
  POLLING_ERROR_EXCEED_SKIP,
  POLLING_ERROR_MIN_FRIENDS,
  POLLING_MODULE_NAME,
  SCHOOL_ERROR_NOT_FOUND_MY_SCHOOL,
  SCHOOL_MODULE_NAME,
} from '../libs/common/errors';
import {APIError} from '../libs/interfaces';
import {
  InternalPolling,
  Polling,
  PollingFriend,
  PollingFriendItem,
  PostPollingVoteRequest,
  RoundEvent,
} from '../libs/interfaces/polling';
import {useEmojiStore} from '../libs/stores';
import FastImage from 'react-native-fast-image';
import {getObjectURLByKey} from '../libs/common/file';
import {useMessageModalStore} from '../libs/stores/message-modal';
import {useInviteFriend} from './use-invite-friend';
import {routes} from '../libs/common';
import {useNavigation} from '@react-navigation/native';

type VoteTarget = 'school' | 'friend';
type PollingState =
  | 'loading' // 투표 조회중
  | 'polling' // 투표중
  | 'lock' // 투표대기
  | 'reach'; // 하루최대도달

const makeFriendItems = (friend: PollingFriend[]): PollingFriendItem[] => {
  return friend.map((x, i) => {
    return {
      gender: x.gender || undefined,
      value: x.profileId,
      source: x.imageFileKey
        ? {uri: getObjectURLByKey(x.imageFileKey, '70')}
        : undefined,
      label: x.name,
    };
  });
};

export function usePolling() {
  const [state, setState] = useState<PollingState | undefined>();

  const [maxDailyCount, setMaxDailyCount] = useState(3);
  const [todayCount, setTodayCount] = useState(1);

  const [pollings, setPollings] = useState<InternalPolling[]>([]);
  const [initialIndex, setInitialIndex] = useState(0);

  const [roundEvent, setRoundEvent] = useState<RoundEvent | null>(null);
  const [remainTime, setRemainTime] = useState<number | null>(null);

  const [userRoundId, setUserRoundId] = useState<string | null>(null);

  /** Polling Index */
  const [pollingIndex, setPollingIndex] = useState(0);
  const pollingIndexRef = useRef(0);
  useEffect(() => {
    pollingIndexRef.current = pollingIndex;
  }, [pollingIndex]);

  /** Emoji */
  const emojis = useEmojiStore(s => s.emojis);
  const emojiInitialized = useEmojiStore(s => s.initialized);
  const emojiIdMapper = useRef<{[emojiId: string]: string}>({});
  useEffect(() => {
    emojiIdMapper.current = emojis.reduce((prev, cur) => {
      return {
        ...prev,
        [cur.id]: cur.key,
      };
    }, {});
  }, [emojis, emojiInitialized]);

  const isSchoolFriendVoite = useRef(false);

  const openMessageModal = useMessageModalStore(s => s.actions.open);

  const navigation = useNavigation();
  const inviteFriend = useInviteFriend();

  const skippedCount = useRef(0);
  const shuffledCount = useRef(0);

  /** Fetch round */
  useEffect(() => {
    // 이모지 초기화 선행 필요.
    if (state === 'loading' && emojiInitialized) {
      const fetchUserRound = async (): Promise<PollingState | undefined> => {
        try {
          const pollingRound = await postPollingRound(
            isSchoolFriendVoite.current ? 0 : 1,
          );

          setMaxDailyCount(pollingRound.maxDailyCount);
          setTodayCount(pollingRound.todayCount);
          if (!pollingRound.data?.complete) {
            // 투표진행중
            if (!pollingRound.data) {
              throw new Error('조회 실패 하였습니다.');
            }
            // 스킵 횟수
            skippedCount.current = pollingRound.data?.pollingIds.filter(
              x => x.skipped,
            ).length;

            setUserRoundId(pollingRound.data.id);
            const initalPolls = pollingRound.data.pollIds.map((x, i) => {
              const polling = pollingRound.data!.pollingIds.find(
                y => x === y.pollId,
              );
              const pollingId = polling?._id || undefined;
              const isVoted = polling?.isVoted || false;
              return {
                pollId: x,
                pollingId,
                isVoted,
                friends: [],
              };
            });
            const curPollingIndex = initalPolls.findIndex(x => !x.isVoted);
            setInitialIndex(curPollingIndex);
            setPollingIndex(curPollingIndex);
            setPollings(initalPolls);
            return 'polling';
          } else {
            // 투표완료
            if (pollingRound.todayCount === pollingRound.maxDailyCount) {
              // 하루 최대 참여
              return 'reach';
            } else {
              // 하루 N번 참여로 시간 제한
              setRemainTime(pollingRound.remainTime);
              return 'lock';
            }
          }
        } catch (error: any) {
          const apiError = error as APIError;
          if (
            apiError &&
            apiError.code === POLLING_ERROR_MIN_FRIENDS &&
            apiError.module === POLLING_MODULE_NAME
          ) {
            // 친구 추가 유도 알림
            if (isSchoolFriendVoite.current) {
              // 학교 알림
              openMessageModal('가입한 학생이 4명이\n되면 시작할 수 있어요!', [
                {text: '확인'},
                {text: '친구 초대', onPress: inviteFriend},
              ]);
            } else {
              openMessageModal('추가한 친구가 4명이\n되면 시작할 수 있어요!', [
                {text: '확인'},
                {
                  text: '친구 추가',
                  onPress: () => {
                    navigation.navigate(routes.friendStack, {add: true});
                  },
                },
              ]);
            }
          } else if (
            apiError.module === SCHOOL_MODULE_NAME &&
            apiError.code === SCHOOL_ERROR_NOT_FOUND_MY_SCHOOL
          ) {
            openMessageModal(
              '프로필 > 프로필 편집을 통해\n학교를 등록해 주세요.',
              [{text: '확인'}],
            );
          } else {
            if (__DEV__) {
              console.error(error);
            }
          }
        }
      };
      fetchUserRound().then(state => {
        if (state === 'polling') {
          // 투표 불러올때는 로딩
          let tm = setTimeout(() => {
            clearTimeout(tm);
            setState(state);
          }, 1000);
        } else {
          setState(state);
        }
      });
    }
  }, [state, emojiInitialized]);

  /** poll & polling 조회 hooks */
  useEffect(() => {
    const handlePolling = async (curPollingIndex: number, preLoad: boolean) => {
      try {
        const poll = pollings[curPollingIndex];
        let polling: Polling;
        if (poll.pollingId) {
          // 폴링 있다면 조회
          polling = await getPolling(poll.pollingId);
        } else {
          // 폴링 없으면
          if (!preLoad) {
            // 다음 투표는 폴 우선 조회
            const resPoll = await getPoll(poll.pollId);
            polling = {
              id: '',
              userRoundId: userRoundId as string,
              pollId: resPoll,
              friendIds: [],
              isVoted: false,
            };
          } else {
            // 현재 선택된 투표는 폴링 생성
            polling = await postPolling({
              pollId: poll.pollId,
              userRoundId: userRoundId as string,
            });
          }
        }

        // 현재 투표 조회시 친구 새로고침 수 초기화
        if (preLoad) {
          shuffledCount.current = 0;
        }

        const emojiURI =
          configs.assetBaseUrl +
          '/' +
          emojiIdMapper.current[polling.pollId.emojiId];

        // 이모지 화면 그려지기전 preLoad
        if (emojiURI) {
          FastImage.preload([
            {
              uri: emojiURI,
            },
          ]);
        }

        // 투표 셋팅
        setPollings(prev => {
          prev[curPollingIndex].pollingId = polling.id;
          prev[curPollingIndex].title = polling.pollId.contentText;
          prev[curPollingIndex].emotion = polling.pollId.emotion;
          prev[curPollingIndex].emojiURI = emojiURI;
          prev[curPollingIndex].friends = makeFriendItems(polling.friendIds);
          return [...prev];
        });
        if (preLoad && pollings.length > curPollingIndex + 1) {
          // 다음꺼 미리 조회
          handlePolling(curPollingIndex + 1, false);
        }
      } catch (error: any) {
        if (__DEV__) {
          console.error(error, 'handlePolling');
        }
        // Alert.alert(error.message || error);
      }
    };

    if (state === 'polling' && pollings.length >= 1 && userRoundId) {
      handlePolling(pollingIndex, true);
    }
  }, [state, pollingIndex, pollings.length, userRoundId]);

  const voting = useRef(false);
  const handlePollingVote = async (
    pollingId: string,
    body: PostPollingVoteRequest,
  ): Promise<boolean> => {
    if (voting.current) {
      return false;
    }
    voting.current = true;
    try {
      const res = await postPollingVote(pollingId, body);
      // 스킵이면 카운팅
      if (body.skipped) {
        skippedCount.current = skippedCount.current + 1;
      }

      if (res.userroundCompleted) {
        // 끝났으면 라운드 다시 조회
        setState('loading');
        // 이벤트는 모달로 처리
        if (res.roundEvent) {
          setRoundEvent(res.roundEvent);
        }
      } else {
        setPollingIndex(prev => prev + 1);
      }
      return true;
    } catch (error: any) {
      const apiError = error as APIError;
      if (__DEV__) {
        console.error(apiError, 'handlePollingVote');
      }
      if (apiError.code === POLLING_ERROR_ALREADY_DONE) {
        Alert.alert('이미 참여한 투표입니다.', undefined, [
          {
            text: '확인',
            onPress: () => {
              setState('loading');
            },
          },
        ]);
      } else if (apiError.code === POLLING_ERROR_EXCEED_SKIP) {
        Alert.alert(
          '투표는 3번까지 건너뛸 수 있어요.',
          '이제 친구들을 투표해 주세요!',
        );
      } else {
        Alert.alert(error.message || error);
      }
      return false;
    } finally {
      voting.current = false;
    }
  };

  const handleSkip = useCallback((pollingId: string) => {
    return handlePollingVote(pollingId, {
      selectedProfileId: undefined,
      skipped: true,
    });
  }, []);

  const handleVote = async (): Promise<boolean> => {
    const poll = pollings[pollingIndexRef.current];
    if (poll.selectedProfileId) {
      return handlePollingVote(poll.pollingId!, {
        selectedProfileId: poll.selectedProfileId,
        skipped: false,
      });
    }
    return false;
  };

  const handleSelectFriend = (pollingId: string, selectedProfileId: string) => {
    setPollings(prev => {
      const index = prev.findIndex(x => x.pollingId === pollingId);
      prev[index].selectedProfileId = selectedProfileId;
      return [...prev];
    });
  };

  const shuffling = useRef(false);

  const handleShuffle = async (pollingId: string) => {
    if (shuffling.current) {
      return;
    }
    shuffling.current = true;
    try {
      const res = await postPollingRefresh(pollingId);
      shuffledCount.current = shuffledCount.current + 1;
      setPollings(prev => {
        prev[pollingIndexRef.current].selectedProfileId = undefined;
        prev[pollingIndexRef.current].friends = makeFriendItems(res.friendIds);
        return [...prev];
      });
    } catch (error: any) {
      const apiError = error as APIError;
      if (apiError.code === POLLING_ERROR_EXCEED_REFRESH) {
        Alert.alert(
          '투표 알림',
          '투표당 최대 3번까지 친구를 다시 찾을 수 있어요.',
        );
      } else {
        Alert.alert(error.message || error);
      }
    }
    shuffling.current = false;
  };

  const clearEvent = useCallback(() => {
    setRoundEvent(null);
  }, []);

  const checkRoundLockOrReach = useCallback(async () => {
    try {
      const pollingRound = await getPollingRoundLock();
      if (!pollingRound.complete) {
        // 진행중인 투표 있음
        setState('loading');
      } else {
        // 진행중인 투표 없음
        if (pollingRound.maxDailyCount === pollingRound.todayCount) {
          // 하루 투표 최대 참여
          setState('reach');
        } else {
          if (pollingRound.remainTime > 0) {
            // 투표 쿨타임
            setState('lock');
            setRemainTime(pollingRound.remainTime);
          } else {
            // 투표 생성 가능
            setState(undefined);
          }
        }
      }
    } catch (error: any) {
      if (__DEV__) {
        console.error(error);
      }
    }
  }, []);

  const getVoteTarget = useCallback((): VoteTarget => {
    if (isSchoolFriendVoite.current) {
      return 'school';
    }
    return 'friend';
  }, []);

  const setVoteTarget = useCallback((target: VoteTarget) => {
    isSchoolFriendVoite.current = target === 'school';
  }, []);

  const handleGetSkippedCount = useCallback(() => {
    return skippedCount.current || 0;
  }, []);

  const handleGetShuffledCount = useCallback(() => {
    return shuffledCount.current || 0;
  }, []);

  return {
    state,
    maxDailyCount,
    fetchRound: () => {
      setState('loading');
    },
    init: () => {
      setState(undefined);
    },
    pollings,
    vote: handleVote,
    skip: handleSkip,
    todayCount,
    getShuffledCount: handleGetShuffledCount,
    getSkippedCount: handleGetSkippedCount,
    selectFriend: handleSelectFriend,
    initialIndex,
    shuffle: handleShuffle,
    currentPollingIndex: pollingIndex,
    clearEvent,
    remainTime,
    event: roundEvent,
    checkRoundLockOrReach,
    getVoteTarget: getVoteTarget,
    setVoteTarget: setVoteTarget,
  };
}
