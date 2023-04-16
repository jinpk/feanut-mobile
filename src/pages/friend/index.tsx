import React, {useCallback, useEffect, useRef} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Alert} from 'react-native';
import {useSyncContacts} from '../../hooks';
import {getFriends, patchFriendHidden} from '../../libs/api/friendship';
import {routes} from '../../libs/common';
import {Friend as FriendI} from '../../libs/interfaces';
import {
  useFriendStore,
  useHiddenFriendStore,
  useUserStore,
} from '../../libs/stores';
import {FreidnsListTemplate} from '../../templates/friend';

type FriendRouteProps = RouteProp<
  {
    Friend: {
      hidden: boolean;
      autoSync?: boolean;
    };
  },
  'Friend'
>;

function Friend() {
  const navigation = useNavigation();
  const {params} = useRoute<FriendRouteProps>();

  const hiddeFriend = params.hidden;

  const ueeStore = hiddeFriend ? useHiddenFriendStore : useFriendStore;

  const friends = ueeStore(s => s.friends);
  const friendsTotalCount = ueeStore(s => s.friendsTotalCount);
  const clear = ueeStore(s => s.actions.clear);
  const query = ueeStore(s => s.query);
  const setQuery = ueeStore(s => s.actions.setQuery);
  const update = ueeStore(s => s.actions.update);
  const removedCount = ueeStore(s => s.removedCount);
  const updateHidden = ueeStore(s => s.actions.updateHidden);
  const userId = useUserStore(s => s.user?.id);
  const add = ueeStore(s => s.actions.add);
  const loading = ueeStore(s => s.loading);
  const setLoading = ueeStore(s => s.actions.setLoading);
  const contact = useSyncContacts();

  // 자동 동기화 진행
  useEffect(() => {
    if (params.autoSync) {
      contact.syncContacts(() => {
        setQuery({page: 1, limit: 20});
        setLoading(true);
      });
    }
  }, [params.autoSync]);

  // 화면 첫 진입 시 조회 요청
  useEffect(() => {
    setLoading(true);
    return () => {
      clear();
    };
  }, []);

  // 친구 조회
  useEffect(() => {
    if (userId && loading) {
      let tm = setTimeout(() => {
        getFriends(userId, {...query, hidden: hiddeFriend ? '1' : '0'})
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

  const handleUnHide = useCallback(
    async (friend: FriendI) => {
      if (!userId || patchState.current) {
        return;
      }

      patchState.current = true;
      try {
        await patchFriendHidden(userId, {
          friendProfileIdId: friend.profileId,
          hidden: false,
        });
        updateHidden(friend.profileId, false);
      } catch (error: any) {
        Alert.alert(error.message || error);
      }
      patchState.current = false;
    },
    [userId],
  );

  const handleItemPress = useCallback((friend: FriendI) => {
    if (friend.profileId) {
      navigation.navigate(routes.feanutCard, {
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

  const handleKeyword = useCallback((keyword: string) => {
    setQuery({page: 1, keyword: keyword || '', limit: 20});
    setLoading(true);
  }, []);

  return (
    <FreidnsListTemplate
      hiddenFriend={hiddeFriend}
      data={friends}
      totalCount={friendsTotalCount}
      onBack={navigation.goBack}
      onHide={handleHide}
      onUnHide={handleUnHide}
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
  );
}

export default Friend;
