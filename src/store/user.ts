import {create} from 'zustand';

export interface UserStore {
  logged: boolean;
  loading: boolean;
  actions: {
    login: () => void;
    check: () => void;
  };
}

const initialState = {
  logged: false,
  loading: true,
};

export const useUserStore = create<UserStore>(set => ({
  ...initialState,
  actions: {
    check: () => set({loading: false}),
    login: () => set({logged: true}),
  },
}));
