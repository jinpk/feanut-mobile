import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  RouteProp,
  useNavigation,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import {
  Alert,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  TouchableOpacity,
  View,
  useAnimatedValue,
} from 'react-native';
import {useSyncContacts} from '../../hooks';
import {getFriends, patchFriendHidden} from '../../libs/api/friendship';
import {colors, constants, routes} from '../../libs/common';
import {Friend as FriendI} from '../../libs/interfaces';
import {useFriendStore, useUserStore} from '../../libs/stores';
import {FreidnsListTemplate} from '../../templates/friend';
import {StyleSheet} from 'react-native';
import {BackTopBar} from '../../components/top-bar';
import {TextButton} from '../../components/button/text-button';
import {Text} from '../../components/text';
import FriendFindTemplate from '../../templates/friend-find';

type FriendRouteProps = RouteProp<
  {
    Friend: {
      autoSync?: boolean;
    };
  },
  'Friend'
>;

function Friend() {
  const navigation = useNavigation();
  const {params} = useRoute<FriendRouteProps>();
  const latestRoute = useNavigationState(s => s.routes[s.routes.length - 1]);
  const tabIndicatorLeft = useAnimatedValue(0);
  const [tabIndex, setTabIndex] = useState(0);
  useEffect(() => {
    const toValue = tabIndex * ((constants.screenWidth - 32) / 2);
    tabIndicatorLeft.setValue(toValue);
  }, [tabIndex]);

  const pagerRef = useRef<ScrollView>(null);

  const friends = useFriendStore(s => s.friends);
  const friendsTotalCount = useFriendStore(s => s.friendsTotalCount);
  const clear = useFriendStore(s => s.actions.clear);
  const query = useFriendStore(s => s.query);
  const setQuery = useFriendStore(s => s.actions.setQuery);
  const update = useFriendStore(s => s.actions.update);
  const removedCount = useFriendStore(s => s.removedCount);
  const updateHidden = useFriendStore(s => s.actions.updateHidden);
  const userId = useUserStore(s => s.user?.id);
  const add = useFriendStore(s => s.actions.add);
  const loading = useFriendStore(s => s.loading);
  const setLoading = useFriendStore(s => s.actions.setLoading);
  const contact = useSyncContacts();

  useEffect(() => {
    if (latestRoute?.name === routes.friendHidden) {
      return () => {
        // 숨김 친구에서 돌아오면 list 초기화
        setQuery({page: 1, limit: 20});
        setLoading(true);
      };
    }
  }, [latestRoute]);

  /*
  // 자동 동기화 진행
  useEffect(() => {
    if (params.autoSync) {
      contact.syncContacts(() => {
        setQuery({page: 1, limit: 20});
        setLoading(true);
        navigation.navigate(routes.home);
      });
    }
  }, [params.autoSync]);*/

  // 친구 조회
  useEffect(() => {
    if (userId && loading) {
      let tm = setTimeout(() => {
        getFriends(userId, query)
          .then(result => {
            if (query.page === 1) {
              update(result.data, result.total);
            } else {
              add(result.data);
            }
            return;
          })
          .catch((error: any) => {
            if (__DEV__) {
              console.error(error);
            }
            return;
          })
          .finally(() => {
            setLoading(false);
          });
      }, 300);
      return () => {
        clearTimeout(tm);
      };
    }
  }, [loading, query.page]);

  // 연속클릭 중복 API 호출 방지
  const patchState = useRef(false);
  const handleHide = useCallback(
    async (friend: FriendI) => {
      if (!userId || patchState.current) {
        return;
      }

      patchState.current = true;
      try {
        await patchFriendHidden(userId, {
          friendProfileIdId: friend.profileId,
          hidden: true,
        });
        updateHidden(friend.profileId, true);
      } catch (error: any) {
        Alert.alert(error.message || error);
      }
      patchState.current = false;
    },
    [userId],
  );

  const handleItemPress = useCallback((friend: FriendI) => {
    if (friend.profileId) {
      navigation.navigate(routes.profile, {
        profileId: friend.profileId,
      });
    }
  }, []);

  const handleSyncContact = useCallback(() => {
    if (contact.loading) {
      return;
    }
    contact.syncContacts(() => {
      setQuery({page: 1, limit: 20});
      setLoading(true);
    });
  }, [contact]);

  const handleLoadMore = useCallback(() => {
    if (loading) {
      return;
    }

    // 아이템 없어지면 리스트 최신화 필요
    if (friends.length < friendsTotalCount) {
      setQuery({
        page: query.page + 1 - Math.ceil(removedCount / 20),
        limit: 20,
      });
      setLoading(true);
    }
  }, [loading, query, friends.length, friendsTotalCount, removedCount]);

  const handleHiddenFriend = useCallback(() => {
    navigation.navigate(routes.friendHidden);
  }, []);

  const handleRefresh = useCallback(() => {
    clear();
    setLoading(true);
  }, []);

  useEffect(() => {
    if (tabIndex === 0) {
      handleRefresh();
    }
  }, [tabIndex]);

  const handleKeyword = useCallback((keyword: string) => {
    setQuery({page: 1, keyword: keyword || '', limit: 20});
    setLoading(true);
  }, []);

  const handlePagerScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.ceil(
        e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width,
      );

      setTabIndex(index < 0 ? 0 : index);
    },
    [],
  );

  return (
    <View style={styles.root}>
      <BackTopBar
        title="친구"
        onBack={navigation.goBack}
        rightComponent={
          <TextButton
            onPress={handleHiddenFriend}
            title="숨김 친구"
            hiddenBorder
            color={colors.darkGrey}
            fontSize={14}
            style={styles.hiddenFriend}
          />
        }
      />
      {/** Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => {
            setTabIndex(0);
            pagerRef.current?.scrollTo({animated: true, x: 0});
          }}
          style={[styles.tab]}>
          <Text
            size={15}
            color={tabIndex === 0 ? colors.dark : colors.darkGrey}
            weight="bold">
            친구 {friendsTotalCount}명
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setTabIndex(1);
            pagerRef.current?.scrollTo({
              animated: true,
              x: constants.screenWidth,
            });
          }}
          style={[styles.tab]}>
          <Text
            size={15}
            color={tabIndex === 1 ? colors.dark : colors.darkGrey}
            weight="bold">
            친구 찾기
          </Text>
        </TouchableOpacity>
        <Animated.View
          style={[styles.tabIndicator, {left: tabIndicatorLeft}]}
        />
      </View>
      {/** Pager */}
      <ScrollView
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        ref={pagerRef}
        onMomentumScrollEnd={handlePagerScroll}
        showsHorizontalScrollIndicator={false}>
        <View style={styles.pager}>
          <FreidnsListTemplate
            data={friends}
            totalCount={friendsTotalCount}
            onBack={navigation.goBack}
            onHide={handleHide}
            onItemPress={handleItemPress}
            onSyncContact={handleSyncContact}
            onLoadMore={handleLoadMore}
            onHiddenFriend={handleHiddenFriend}
            loading={loading}
            onRefresh={handleRefresh}
            onKeyword={handleKeyword}
            keyword={query.keyword || ''}
            synchronizing={contact.loading}
          />
        </View>
        <View style={styles.pager}>
          <FriendFindTemplate focused={tabIndex === 1} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  hiddenFriend: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.mediumGrey,
    marginHorizontal: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  tabFocused: {
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  tabIndicator: {
    height: 1,
    width: (constants.screenWidth - 32) / 2,
    backgroundColor: colors.primary,
    position: 'absolute',
    bottom: 0,
  },
  pager: {
    width: constants.screenWidth,
  },
});

export default Friend;
