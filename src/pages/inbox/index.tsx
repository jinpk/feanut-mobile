import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {useCoin, useInbox} from '../../hooks';
import {routes} from '../../libs/common';
import {PollingReceiveItem} from '../../libs/interfaces/polling';
import InboxTemplate from '../../templates/inbox';

function Inbox(): JSX.Element {
  const navigation = useNavigation();
  const inbox = useInbox();
  const coinAmount = useCoin().amount;

  // 1. 상세페이지에서 결제했으면 코인 수량 차감
  // 2. 코인수량 이벤트 확인하면 새로고침
  useEffect(() => {
    return () => {
      inbox.refresh();
    };
  }, [coinAmount]);

  const handleItemPress = useCallback(
    (item: PollingReceiveItem, index: number) => {
      navigation.navigate(routes.inboxDetail, {pollingId: item._id});
    },
    [],
  );

  return (
    <InboxTemplate
      data={inbox.pulls}
      onBack={navigation.goBack}
      onItemPress={handleItemPress}
      onLoadMore={inbox.nextPage}
      loading={inbox.loading}
      onRefresh={inbox.refresh}
    />
  );
}

export default Inbox;
