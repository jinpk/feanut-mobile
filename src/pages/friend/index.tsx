import React, {useCallback, useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {TouchableOpacity, View} from 'react-native';
import {colors, routes} from '../../libs/common';
import {StyleSheet} from 'react-native';
import {BackTopBar} from '../../components/top-bar';
import {Text} from '../../components/text';
import Pager from '../../components/pager';
import Tabs from '../../components/tabs';
import FriendListFeature from '../../features/friend-list';
import {useFriendStore, useUserStore} from '../../libs/stores';
import FriendFindFeature from '../../features/friend-find';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type FriendRoute = RouteProp<{Friend: {add: boolean; list: boolean}}, 'Friend'>;

function Friend() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<FriendRoute>();
  const friendsTotalCount = useFriendStore(s => s.friendsTotalCount);
  const userId = useUserStore(s => s.user?.id);

  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    if (route.params?.add) {
      setPage(2);
      navigation.setParams({add: undefined});
    } else if (route.params?.list) {
      setPage(1);
      navigation.setParams({list: undefined});
    }
  }, [route.params?.add, route.params?.list]);

  const handleHiddenFriend = useCallback(() => {
    navigation.navigate(routes.friendHidden);
  }, []);

  return (
    <View style={[styles.root, {paddingBottom: insets.bottom}]}>
      <BackTopBar
        title="친구"
        rightComponent={
          <TouchableOpacity
            onPress={handleHiddenFriend}
            style={styles.hiddenFriend}>
            <Text color={colors.darkGrey}>숨김친구</Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.tabs}>
        <Tabs
          titles={[`친구 ${friendsTotalCount}명`, `친구 추천`]}
          index={page - 1}
          onIndexChange={index => {
            setPage(index + 1);
          }}
        />
      </View>
      <Pager page={page} onPageChange={setPage}>
        <View>
          <FriendListFeature focused={page === 1} />
        </View>
        <View>
          {userId !== undefined && Boolean(userId) && (
            <FriendFindFeature focused={page === 2} userId={userId} />
          )}
        </View>
      </Pager>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  hiddenFriend: {
    padding: 16,
  },
  tabs: {
    marginHorizontal: 16,
  },
});

export default Friend;
