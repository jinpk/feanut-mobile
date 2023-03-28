import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
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

function Friend() {
  const navigation = useNavigation();
  const {params} = useRoute<RouteProp<{Friend: {hidden: boolean}}, 'Friend'>>();

  const hiddeFriend = params.hidden;
  const ueeStore = hiddeFriend ? useHiddenFriendStore : useFriendStore;

  const friends = ueeStore(s => s.friends);
  const friendsTotalCount = ueeStore(s => s.friendsTotalCount);
  const clear = ueeStore(s => s.actions.clear);
  const query = ueeStore(s => s.query);
  const setQuery = ueeStore(s => s.actions.setQuery);
  const update = ueeStore(s => s.actions.update);
  const updateHidden = ueeStore(s => s.actions.updateHidden);
  const userId = useUserStore(s => s.user?.id);
  const add = ueeStore(s => s.actions.add);
  const loading = ueeStore(s => s.loading);
  const setLoading = ueeStore(s => s.actions.setLoading);
  const contact = useSyncContacts();

  useEffect(() => {
    if (userId && loading) {
      let tm = setTimeout(() => {
        console.log(
          hiddeFriend ? 'hidden' : 'active',
          'friends fetch :',
          query,
        );
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
            Alert.alert(error.message || error);
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

  useEffect(() => {
    setLoading(true);
    return () => {
      clear();
    };
  }, []);

  const handleHide = useCallback(
    async (friend: FriendI) => {
      if (!userId) return;

      try {
        await patchFriendHidden(userId, {
          friendProfileIdId: friend.profileId,
          hidden: true,
        });
        updateHidden(friend.profileId, true);
      } catch (error: any) {
        Alert.alert(error.message || error);
      }
    },
    [userId],
  );

  const handleUnHide = useCallback(
    async (friend: FriendI) => {
      if (!userId) return;

      try {
        await patchFriendHidden(userId, {
          friendProfileIdId: friend.profileId,
          hidden: false,
        });
        updateHidden(friend.profileId, false);
      } catch (error: any) {
        Alert.alert(error.message || error);
      }
    },
    [userId],
  );

  const handleItemPress = useCallback((friend: FriendI) => {}, []);

  const handleSyncContact = useCallback(() => {
    if (contact.loading) return;
    contact.syncContacts(() => {
      setQuery(1);
      setLoading(true);
    });
  }, [contact]);

  const handleLoadMore = useCallback(() => {
    if (loading) return;

    if (friends.length < friendsTotalCount) {
      setQuery({page: query.page + 1, limit: 10});
      setLoading(true);
    }
  }, [loading, query, friends.length, friendsTotalCount]);

  const handleHiddenFriend = useCallback(() => {
    navigation.navigate(routes.friendHidden);
  }, []);

  const handleRefresh = useCallback(() => {
    clear();
    setLoading(true);
  }, []);

  const handleKeyword = useCallback((keyword: string) => {
    setQuery({page: 1, keyword: keyword || '', limit: 10});
    setLoading(true);
  }, []);

  return (
    <FreidnsListTemplate
      hiddenFriend={hiddeFriend}
      data={friends}
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
    />
  );
}

export default Friend;
