import {create} from 'zustand';
import {Friend, PagenatedRequest} from '../interfaces';

export interface FriendStore {
  friends: Friend[];
  friendsTotalCount: number;
  query: PagenatedRequest;
  loading: boolean;
  actions: {
    update: (friends: Friend[], friendsTotalCount: number) => void;
    updateHidden: (profileid: string, hidden: boolean) => void;
    add: (friends: Friend[]) => void;
    clear: () => void;
    setQuery: (page: number, limit?: number) => void;
    setLoading: (loading: boolean) => void;
  };
}

const initialState = {
  friends: [],
  friendsTotalCount: 0,
  query: {page: 1, limit: 10},
  loading: false,
};

const getFriendStore = () => {
  return create<FriendStore>((set, get) => ({
    ...initialState,
    actions: {
      setLoading: (loading: boolean) => {
        set({loading});
      },
      setQuery: (page: number, limit?: number) => {
        const query = get().query;
        set({
          query: {
            page: page,
            limit: limit || query.limit,
          },
        });
      },
      clear: () => {
        set({...initialState});
      },
      update: (friends: Friend[], friendsTotalCount: number) => {
        set({friends, friendsTotalCount});
      },
      updateHidden: (profileId: string, hidden: boolean) => {
        const friends = get().friends;
        const friendsTotalCount = get().friendsTotalCount;
        set({
          friends: [...friends.filter(x => x.profileId !== profileId)],
          friendsTotalCount: friendsTotalCount - 1,
        });
      },
      add: (friends: Friend[]) => {
        set({friends: [...get().friends, ...friends]});
      },
    },
  }));
};

export const useFriendStore = getFriendStore();
export const useHiddenFriendStore = getFriendStore();
