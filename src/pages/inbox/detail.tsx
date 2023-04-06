import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import InboxDetailTemplate from '../../templates/inbox/detail';
import {getPollingReceiveDetail, openPull} from '../../libs/api/poll';
import {Alert} from 'react-native';
import {PollingReceiveDetail} from '../../libs/interfaces/polling';
import {routes} from '../../libs/common';
import {APIError} from '../../libs/interfaces';
import {
  POLLING_ERROR_ALREADY_DONE,
  POLLING_ERROR_LACK_COIN_AMOUNT,
} from '../../libs/common/errors';
import {useCoin, useGetEmojiURI} from '../../hooks';
import DrawedShareTemplate from '../../templates/inbox/drawed-share';
import {useProfileStore} from '../../libs/stores';
import {getMyProfile} from '../../libs/api/profile';
import {configs} from '../../libs/common/configs';

function InboxDetail() {
  const {
    params: {pollingId},
  } = useRoute<RouteProp<{InboxDetail: {pollingId: string}}, 'InboxDetail'>>();
  const navigation = useNavigation();
  const [pull, setPull] = useState<PollingReceiveDetail | undefined>(undefined);
  const fetchAmount = useCoin().fetchAmount;
  const [shareMode, setShareMode] = useState(false);

  /** 공유하기 기능용 프로필 업데이트 */
  const name = useProfileStore(s => s.profile.name);
  const profileImageKey = useProfileStore(s => s.profile.profileImageKey);
  const updateProfile = useProfileStore(s => s.actions.update);
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
      Alert.alert(error.message || error);
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
    } catch (error) {
      const apiError = error as APIError;
      if (apiError.code === POLLING_ERROR_LACK_COIN_AMOUNT) {
        Alert.alert(
          '보유한 피넛 수량이 부족합니다.',
          '홈 > 프로필 메뉴에서 피넛을 구매할 수 있어요.',
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
      Alert.alert(
        '투표한 친구 확인하기',
        '피넛 3개를 사용하여 나를\n투표한 친구를 확인할까요?',
        [
          {
            text: '확인하기',
            onPress: () => handleOnOpen(pull!._id),
            isPreferred: true,
          },
          {text: '취소', style: 'cancel'},
        ],
        {cancelable: true, userInterfaceStyle: 'light'},
      );
    } else {
      navigation.navigate(routes.feanutCard, {profileId: pull.voter.profileId});
    }
  };

  return (
    <>
      <InboxDetailTemplate
        onBack={navigation.goBack}
        pull={pull}
        onShare={handleShare}
        onOpen={handleOpen}
      />
      {shareMode && pull && (
        <DrawedShareTemplate
          name={name}
          profileImage={
            profileImageKey
              ? configs.cdnBaseUrl + '/' + profileImageKey
              : undefined
          }
          icon={pullEmojiURI}
          emotion={pull.pollId.emotion}
          title={pull.pollId.contentText}
          completedAt={pull.completedAt}
          onClose={() => {
            setShareMode(false);
          }}
        />
      )}
    </>
  );
}

export default InboxDetail;
