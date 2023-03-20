import {create} from 'zustand';

export interface UserStore {
  // 세션정보 조회중 상태
  loading: boolean;
  // 로그인 여부
  logged: boolean;
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
