import React, {useCallback, useEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Alert, View} from 'react-native';
import {useSyncContacts} from '../../hooks';
import {getFriends, patchFriendHidden} from '../../libs/api/friendship';
import {colors, routes} from '../../libs/common';
import {Friend as FriendI} from '../../libs/interfaces';
import {useHiddenFriendStore, useUserStore} from '../../libs/stores';
import {FreidnsListTemplate} from '../../templates/friend';
import {StyleSheet} from 'react-native';
import {BackTopBar} from '../../components/top-bar';

function FriendHidden() {
  const navigation = useNavigation();
  const friends = useHiddenFriendStore(s => s.friends);
  const friendsTotalCount = useHiddenFriendStore(s => s.friendsTotalCount);
  const clear = useHiddenFriendStore(s => s.actions.clear);
  const query = useHiddenFriendStore(s => s.query);
  const setQuery = useHiddenFriendStore(s => s.actions.setQuery);
  const update = useHiddenFriendStore(s => s.actions.update);
  const removedCount = useHiddenFriendStore(s => s.removedCount);
  const updateHidden = useHiddenFriendStore(s => s.actions.updateHidden);
  const userId = useUserStore(s => s.user?.id);
  const add = useHiddenFriendStore(s => s.actions.add);
  const loading = useHiddenFriendStore(s => s.loading);
  const setLoading = useHiddenFriendStore(s => s.actions.setLoading);
  const contact = useSyncContacts();

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
        getFriends(userId, {...query, hidden: '1'})
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

  const handleRefresh = useCallback(() => {
    clear();
    setLoading(true);
  }, []);

  const handleKeyword = useCallback((keyword: string) => {
    setQuery({page: 1, keyword: keyword || '', limit: 20});
    setLoading(true);
  }, []);

  return (
    <View style={styles.root}>
      <BackTopBar title="숨김 친구" onBack={navigation.goBack} />
      <FreidnsListTemplate
        hiddenFriend
        data={friends}
        totalCount={friendsTotalCount}
        onBack={navigation.goBack}
        onUnHide={handleUnHide}
        onLoadMore={handleLoadMore}
        loading={loading}
        onRefresh={handleRefresh}
        onKeyword={handleKeyword}
        keyword={query.keyword || ''}
        synchronizing={contact.loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default FriendHidden;
