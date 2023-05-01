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
import {useFriendStore} from '../../libs/stores';
import FriendFindFeature from '../../features/friend-find';

type FriendRoute = RouteProp<{Friend: {add: boolean}}, 'Friend'>;

function Friend() {
  const navigation = useNavigation();
  const route = useRoute<FriendRoute>();
  const friendsTotalCount = useFriendStore(s => s.friendsTotalCount);

  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    if (route.params?.add) {
      setPage(2);
    }
  }, [route.params?.add]);

  const handleHiddenFriend = useCallback(() => {
    navigation.navigate(routes.friendHidden);
  }, []);

  return (
    <View style={styles.root}>
      <BackTopBar
        onBack={navigation.goBack}
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
          <FriendFindFeature focused={page === 2} />
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
