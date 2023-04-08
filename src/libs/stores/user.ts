import {create} from 'zustand';
import {setAPIAuthorization} from '../api';
import {
  clearCredentials,
  clearUser,
  getCredentials,
  getUserFromStorage,
} from '../common';
import {NotificationData, TokenResponse, User} from '../interfaces';

export interface UserStore {
  // 세션정보 조회중 상태
  loading: boolean;
  // 로그인 여부
  logged: boolean;
  user: User | null;

  notification?: NotificationData;
  actions: {
    login: (user: User) => void;
    logout: () => Promise<void>;
    check: () => Promise<void>;
    clearNotification: () => void;
  };
}

const initialState = {
  logged: false,
  loading: true,
  user: null,
};

export const useUserStore = create<UserStore>((set, get) => ({
  ...initialState,
  actions: {
    check: async () => {
      try {
        const user = await getUserFromStorage();
        const credentials = await getCredentials();
        // 로컬 정보만 있으면 유효성 검사 없이 자동 로그인
        // 토큰 인증은 axios interceptor에게 위임
        if (user && credentials) {
          const token = credentials as TokenResponse;
          setAPIAuthorization(token.accessToken);
          get().actions.login(user);
        }
      } catch (error) {
        await clearUser();
        await clearCredentials();
      }

      set({loading: false});
    },
    clearNotification: () => set({notification: undefined}),
    login: (user: User) => set({logged: true, user, loading: false}),
    logout: async () => {
      console.log('logout');
      await clearCredentials();
      await clearUser();
      setAPIAuthorization('');
      set({logged: false, loading: false, user: null});
    },
  },
}));
