import {useCallback, useEffect, useRef, useState} from 'react';
import {Alert} from 'react-native';
import {
  getPolling,
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
import {useEmojiStore, useUserStore} from '../libs/stores';

type PollingState =
  | 'loading' // 투표 조회중
  | 'reject' // 투표 불가능 (친구수 부족)
  | 'polling' // 투표중
  | 'lock' // 투표대기
  | 'reach'; // 하루최대도달

const makeFriendItems = (friend: PollingFriend[]): PollingFriendItem[] => {
  return friend.map((x, i) => {
    return {
      gender: i % 2 === 0 ? 'male' : 'female',
      value: x.profileId,
      source: x.imageFileKey
        ? {uri: configs.cdnBaseUrl + '/' + x.imageFileKey}
        : undefined,
      label: x.name,
    };
  });
};

export function usePolling() {
  const userId = useUserStore(s => s.user?.id);

  const [state, setState] = useState<PollingState | undefined>();

  const [maxDailyCount, setMaxDailyCount] = useState(3);
  const [todayCount, setTodayCount] = useState(1);

  const [pollings, setPollings] = useState<InternalPolling[]>([]);
  const [pollingIndex, setPollingIndex] = useState(0);
  const [initialIndex, setInitialIndex] = useState(0);

  const [roundEvent, setRoundEvent] = useState<RoundEvent | null>(null);
  const [remainTime, setRemainTime] = useState<number | null>(null);

  const [userRoundId, setUserRoundId] = useState<string | null>(null);

  /** Emoji */
  const emojis = useEmojiStore(s => s.emojis);
  const emojiIdMapper = useRef<{[emojiId: string]: string}>({});
  useEffect(() => {
    emojiIdMapper.current = emojis.reduce((prev, cur) => {
      return {
        ...prev,
        [cur.id]: cur.key,
      };
    }, {});
  }, [emojis]);

  /** Fetch round */
  useEffect(() => {
    if (state === 'loading') {
      const fetchUserRound = async () => {
        try {
          const pollingRound = await postPollingRound();
          setMaxDailyCount(pollingRound.maxDailyCount);
          setTodayCount(pollingRound.todayCount);

          if (!pollingRound.data?.complete) {
            // 투표진행중
            if (!pollingRound.data) {
              throw new Error('조회 실패 하였습니다.');
            }
            setUserRoundId(pollingRound.data._id);
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
            setState('polling');
          } else {
            // 투표완료
            if (pollingRound.todayCount === pollingRound.maxDailyCount) {
              // 하루 최대 참여
              setState('reach');
            } else {
              // 시간 제한
              setState('lock');
              setRemainTime(pollingRound.remainTime);
            }
          }
        } catch (error: any) {
          const apiError = error as APIError;
          if (apiError.code === POLLING_ERROR_MIN_FRIENDS) {
            setState('reject');
          } else {
            Alert.alert(apiError.message);
          }
        }
      };
      fetchUserRound();
    }
  }, [state]);

  /** Init */
  useEffect(() => {
    if (userId) {
      setState('loading');
    }
  }, []);

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
          // 폴링 없으면 생성
          polling = await postPolling({
            pollId: poll.pollId,
            userRoundId: userRoundId as string,
          });
        }

        // 투표 셋팅
        setPollings(prev => {
          prev[curPollingIndex].pollingId = polling.id;
          prev[curPollingIndex].title = polling.pollId.contentText;
          prev[curPollingIndex].emotion = polling.pollId.emotion;
          prev[curPollingIndex].emojiURI =
            'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Beating%20Heart.png' ||
            configs.cdnBaseUrl +
              '/' +
              emojiIdMapper.current[polling.pollId.emojiId];
          prev[curPollingIndex].friends = makeFriendItems(polling.friendIds);
          return [...prev];
        });
        if (preLoad && pollings.length > curPollingIndex + 1) {
          // 다음꺼 미리 조회
          handlePolling(curPollingIndex + 1, false);
        }
      } catch (error: any) {
        console.error(error, 'handlePolling');
        Alert.alert(error.message || error);
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
  ) => {
    if (voting.current) return;
    voting.current = true;
    try {
      const res = await postPollingVote(pollingId, body);
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
    } catch (error: any) {
      console.error(error, 'handlePollingVote');
      const apiError = error as APIError;
      if (apiError.code === POLLING_ERROR_ALREADY_DONE) {
        Alert.alert('이미 참여한 투표입니다.');
      } else if (apiError.code === POLLING_ERROR_EXCEED_SKIP) {
        Alert.alert(
          '투표는 3번까지 건너뛸 수 있어요.',
          '이제 친구들을 투표해 주세요!',
        );
      } else {
        Alert.alert(error.message || error);
      }
    }
    voting.current = false;
  };

  const handleVote = async () => {
    const poll = pollings[pollingIndex];
    if (!poll.pollingId) {
      Alert.alert('투표를 완료할 수 없습니다.');
    } else if (!poll.selectedProfileId) {
      Alert.alert('친구를 선택해 주세요.');
    } else {
      handlePollingVote(poll.pollingId!, {
        selectedProfileId: poll.selectedProfileId,
      });
    }
  };

  const handleSkip = async (pollingId: string) => {
    handlePollingVote(pollingId, {
      skipped: true,
    });
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
    if (shuffling.current) return;
    shuffling.current = true;
    try {
      const res = await postPollingRefresh(pollingId);
      setPollings(prev => {
        prev[pollingIndex].friends = makeFriendItems(res.friendIds);
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

  return {
    state,
    maxDailyCount,
    reInit: () => {
      setState('loading');
    },
    pollings,
    vote: handleVote,
    todayCount,
    selectFriend: handleSelectFriend,
    skip: handleSkip,
    initialIndex,
    shuffle: handleShuffle,
    currentPollingIndex: pollingIndex,
    clearEvent,
    remainTime,
    event: roundEvent,
  };
}
