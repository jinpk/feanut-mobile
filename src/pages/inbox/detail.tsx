import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import InboxDetailTemplate from '../../templates/inbox/detail';
import {getPollingReceiveDetail, openPull} from '../../libs/api/poll';
import {Alert, StatusBar} from 'react-native';
import {PollingReceiveDetail} from '../../libs/interfaces/polling';
import {colors, constants, routes} from '../../libs/common';
import {APIError} from '../../libs/interfaces';
import {
  POLLING_ERROR_ALREADY_DONE,
  POLLING_ERROR_LACK_COIN_AMOUNT,
} from '../../libs/common/errors';
import {useCoin, useGetEmojiURI} from '../../hooks';
import DrawedShareTemplate from '../../templates/inbox/drawed-share';
import {useModalStore, useProfileStore} from '../../libs/stores';
import {getMyProfile} from '../../libs/api/profile';
import {getObjectURLByKey} from '../../libs/common/file';
import OpenModalTemplate from '../../templates/inbox/open-modal';
import {useMessageModalStore} from '../../libs/stores/message-modal';

function InboxDetail() {
  const {
    params: {pollingId},
  } = useRoute<RouteProp<{InboxDetail: {pollingId: string}}, 'InboxDetail'>>();
  const navigation = useNavigation();
  const [pull, setPull] = useState<PollingReceiveDetail | undefined>(undefined);
  const fetchAmount = useCoin().fetchAmount;
  const [shareMode, setShareMode] = useState(false);

  const openMessage = useMessageModalStore(s => s.actions.open);

  /** 공유하기 기능용 프로필 업데이트 */
  const profile = useProfileStore(s => s.profile);
  const name = profile.name;
  const profileImageKey = profile.profileImageKey;
  const updateProfile = useProfileStore(s => s.actions.update);

  const [opened, setOpened] = useState(false);

  const openCoinModal = useModalStore(s => s.actions.openCoin);
  const focused = useIsFocused();
  useEffect(() => {
    if (constants.platform === 'ios') {
      if (focused) {
        StatusBar.setBarStyle('light-content');
        return () => {
          StatusBar.setBarStyle('dark-content');
        };
      }
    }
  }, [focused]);

  /** iOS 상태바 색 변경 */
  useEffect(() => {
    if (constants.platform === 'ios') {
      StatusBar.setBarStyle('light-content');
    }
    return () => {
      if (constants.platform === 'ios') {
        StatusBar.setBarStyle('dark-content');
      }
    };
  }, []);

  useEffect(() => {
    if (!name) {
      getMyProfile().then(updateProfile);
    }
  }, [name]);

  const pullEmojiURI = useGetEmojiURI(pull?.pollId?.emojiId);

  const fetchData = async (pollingId: string) => {
    try {
      const data = await getPollingReceiveDetail(pollingId);
      setPull(data);
    } catch (error: any) {
      if (__DEV__) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    fetchData(pollingId);
  }, [pollingId]);

  const handleShare = () => {
    setShareMode(true);
  };

  const handleOnOpen = async (pollingId: string) => {
    try {
      await openPull(pollingId);
      fetchData(pollingId);
      fetchAmount();
      setOpened(true);
    } catch (error) {
      const apiError = error as APIError;
      if (apiError.code === POLLING_ERROR_LACK_COIN_AMOUNT) {
        openMessage(
          '버터가 부족해요\n버터는 꾸준한 투표를 통해 얻을 수 있어요.',
          [
            {text: '확인'},
            {
              text: '구매하기',
              color: colors.blue,
              onPress: () => {
                openCoinModal();
              },
            },
          ],
        );
      } else if (apiError.code === POLLING_ERROR_ALREADY_DONE) {
        Alert.alert('이미 결제한 투표입니다');
        fetchData(pollingId);
      } else {
        Alert.alert(apiError.message);
      }
    }
  };

  const handleOpen = async () => {
    if (!pull?.isOpened) {
      openMessage('3 버터를 사용하여\n투표한 친구를 확인할 수 있어요.', [
        {text: '취소'},
        {
          text: '확인하기',
          color: colors.blue,
          onPress: () => {
            handleOnOpen(pull!._id);
          },
        },
      ]);
    } else {
      navigation.navigate(routes.profile, {profileId: pull.voter.profileId});
    }
  };

  return (
    <>
      <InboxDetailTemplate
        myProfile={profile}
        onBack={navigation.goBack}
        pull={pull}
        onShare={handleShare}
        onOpen={handleOpen}
      />
      {shareMode && pull && (
        <DrawedShareTemplate
          name={name}
          profileImage={getObjectURLByKey(profileImageKey, '150')}
          icon={pullEmojiURI}
          emotion={pull.pollId.emotion}
          title={pull.pollId.contentText}
          completedAt={pull.completedAt}
          onClose={() => {
            setShareMode(false);
          }}
        />
      )}
      <OpenModalTemplate
        visible={(pull?.isOpened && opened) || false}
        onClose={() => {
          setOpened(false);
        }}
        name={pull?.voter?.name || ''}
        onProfile={() => {
          navigation.navigate(routes.profile, {
            profileId: pull.voter.profileId,
          });
        }}
      />
    </>
  );
}

export default InboxDetail;
