import {create} from 'zustand';
import {Friend, GetFriendsRequest} from '../interfaces';

export interface FriendStore {
  friends: Friend[];
  friendsTotalCount: number;
  query: GetFriendsRequest;
  removedCount: number;
  loading: boolean;
  actions: {
    update: (friends: Friend[], friendsTotalCount: number) => void;
    updateHidden: (profileid: string, hidden: boolean) => void;
    add: (friends: Friend[]) => void;
    clear: () => void;
    setQuery: (query: GetFriendsRequest) => void;
    setLoading: (loading: boolean) => void;
  };
}

const initialState = {
  friends: [],
  friendsTotalCount: 0,
  query: {page: 1, limit: 20},
  loading: false,
  removedCount: 0,
};

const getFriendStore = () => {
  return create<FriendStore>((set, get) => ({
    ...initialState,
    actions: {
      setLoading: (loading: boolean) => {
        set({loading});
      },
      setQuery: (query: GetFriendsRequest) => {
        const prevQuery = get().query;
        set({
          query: {
            ...prevQuery,
            ...query,
          },
        });
      },
      clear: () => {
        set({...initialState});
      },
      update: (friends: Friend[], friendsTotalCount: number) => {
        set({friends, friendsTotalCount, removedCount: 0});
      },
      updateHidden: (profileId: string, hidden: boolean) => {
        const friends = get().friends;
        const friendsTotalCount = get().friendsTotalCount;
        const removedCount = get().removedCount;
        set({
          friends: [...friends.filter(x => x.profileId !== profileId)],
          friendsTotalCount: friendsTotalCount - 1,
          removedCount: removedCount + 1,
        });
      },
      add: (friends: Friend[]) => {
        set({friends: [...get().friends, ...friends], removedCount: 0});
      },
    },
  }));
};

export const useFriendStore = getFriendStore();
export const useHiddenFriendStore = getFriendStore();
