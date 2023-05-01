import {useNavigation, useNavigationState} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {useCoin, useInbox} from '../../hooks';
import {colors, routes} from '../../libs/common';
import {PollingReceiveItem} from '../../libs/interfaces/polling';
import InboxTemplate from '../../templates/inbox';
import {useProfileStore} from '../../libs/stores';
import {getMyProfile} from '../../libs/api/profile';
import {StyleSheet, View} from 'react-native';
import {BackTopBar} from '../../components/top-bar';
import {TextButton} from '../../components/button/text-button';

function Inbox(): JSX.Element {
  const navigation = useNavigation();
  const inbox = useInbox();
  const coinAmount = useCoin().amount;
  const name = useProfileStore(s => s.profile.name);
  const updateProfile = useProfileStore(s => s.actions.update);

  useEffect(() => {
    getMyProfile().then(profile => {
      updateProfile(profile);
    });
  }, []);

  // 1. 상세페이지에서 결제했으면 코인 수량 차감
  // 2. 코인수량 이벤트 확인하면 새로고침
  useEffect(() => {
    return () => {
      inbox.refresh();
    };
  }, [coinAmount]);

  /** 편집 화면에서 돌아오면 새로고침 */
  const latestRoute = useNavigationState(s => s.routes[s.routes.length - 1]);
  useEffect(() => {
    if (latestRoute?.name === routes.inboxEdit) {
      return () => {
        inbox.refresh();
      };
    }
  }, [latestRoute]);

  const handleItemPress = useCallback(
    (item: PollingReceiveItem, index: number) => {
      navigation.navigate(routes.inboxDetail, {pollingId: item._id});
    },
    [],
  );

  return (
    <View style={styles.root}>
      <BackTopBar
        onBack={navigation.goBack}
        title="수신함"
        rightComponent={
          <TextButton
            style={styles.edit}
            title="편집"
            hiddenBorder
            color={colors.darkGrey}
            onPress={() => {
              navigation.navigate(routes.inboxEdit);
            }}
          />
        }
      />
      <InboxTemplate
        data={inbox.pulls}
        onItemPress={handleItemPress}
        onLoadMore={inbox.nextPage}
        loading={inbox.loading}
        onRefresh={inbox.refresh}
        name={name}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  edit: {
    padding: 16,
  },
});
export default Inbox;
