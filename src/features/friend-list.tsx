import React, {memo, useCallback, useEffect, useRef} from 'react';
import {useNavigation, useNavigationState} from '@react-navigation/native';
import {Alert} from 'react-native';
import {getFriends, patchFriendHidden} from '../libs/api/friendship';
import {routes} from '../libs/common';
import {Friend as FriendI} from '../libs/interfaces';
import {useFriendStore, useUserStore} from '../libs/stores';
import {FreidnsListTemplate} from '../templates/friend';

type FriendListFeatureProps = {focused: boolean};

function FriendListFeature(props: FriendListFeatureProps) {
  const navigation = useNavigation();
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

  /** 숨김 화면에서 돌아오면 새로고침 */
  const latestRoute = useNavigationState(s => s.routes[s.routes.length - 1]);
  useEffect(() => {
    if (latestRoute?.name === routes.friendHidden) {
      return () => {
        setQuery({page: 1, limit: 20});
        setLoading(true);
      };
    }
  }, [latestRoute]);

  useEffect(() => {
    if (props.focused) {
      setQuery({page: 1, keyword: '', limit: 20});
      setLoading(true);
    }
  }, [props.focused]);

  // 친구 조회
  useEffect(() => {
    if (userId && loading) {
      getFriends(userId, {...query})
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
    <FreidnsListTemplate
      data={friends}
      totalCount={friendsTotalCount}
      onItemPress={handleItemPress}
      onItemButtonPress={handleHide}
      onLoadMore={handleLoadMore}
      loading={loading}
      onRefresh={handleRefresh}
      onKeyword={handleKeyword}
      keyword={query.keyword || ''}
    />
  );
}

export default memo(
  FriendListFeature,
  (prev, cur) => prev.focused === cur.focused,
);
