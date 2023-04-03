import {
  Link,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import InboxDetailTemplate from '../../templates/inbox/detail';
import {getPollingReceiveDetail, openPull} from '../../libs/api/poll';
import {Alert, Linking} from 'react-native';
import {PollingReceiveDetail} from '../../libs/interfaces/polling';
import Share from 'react-native-share';
import {routes} from '../../libs/common';
import {APIError} from '../../libs/interfaces';
import {
  POLLING_ERROR_ALREADY_DONE,
  POLLING_ERROR_LACK_COIN_AMOUNT,
} from '../../libs/common/errors';
import {useCoin} from '../../hooks';

function InboxDetail() {
  const {
    params: {pollingId},
  } = useRoute<RouteProp<{InboxDetail: {pollingId: string}}, 'InboxDetail'>>();
  const navigation = useNavigation();
  const [pull, setPull] = useState<PollingReceiveDetail | undefined>(undefined);
  const fetchAmount = useCoin().fetchAmount;

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
    Share.open({
      title: '친구가 나를 투표했어요!',
      message: '친구가 나를 투표했어요!',
      //url?: ;
      //urls?: string[];
      //type?: string;
      subject: '친구가 나를 투표했어요!',
      showAppsToView: true,
      //filename?: string;
      //saveToFiles?: boolean;
      //activityItemSources?: ActivityItemSource[];
      isNewTask: true,
    })
      .then(res => {})
      .catch(err => {});
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
    <InboxDetailTemplate
      onBack={navigation.goBack}
      pull={pull}
      onShare={handleShare}
      onOpen={handleOpen}
    />
  );
}

export default InboxDetail;
