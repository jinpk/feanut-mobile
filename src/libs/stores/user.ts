import {create} from 'zustand';
import {setAPIAuthorization} from '../api';
import {getMe} from '../api/users';
import {
  clearCredentials,
  getCredentials,
  isTokenExpired,
  setCredentials,
} from '../common';
import {TokenResponse, User} from '../interfaces';
import {postToken} from '../api/auth';

export interface UserStore {
  // 세션정보 조회중 상태
  loading: boolean;
  // 로그인 여부
  logged: boolean;
  user: User | null;
  actions: {
    login: (user: User) => void;
    logout: () => Promise<void>;
    check: () => Promise<void>;
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
        let credentials = await getCredentials();
        if (!credentials) {
          set({loading: false});
        } else {
          let token = credentials as TokenResponse;

          // 토큰 만료 체크
          if (isTokenExpired(token.accessToken)) {
            console.log(
              'access token expired. please reissue token by refresh token',
            );
            if (isTokenExpired(token.refreshToken)) {
              throw new Error('refresh token expired. please login again');
            }
            token = await postToken({refreshToken: token.refreshToken});
            console.log('successfully reissued token');
            setCredentials(token);
          }

          // 로그인
          setAPIAuthorization(token.accessToken);
          get().actions.login(await getMe());
        }
      } catch (error: any) {
        console.error('Check credentials failed.', error);
        clearCredentials();
        set({loading: false});
      }
    },
    login: (user: User) => set({logged: true, user, loading: false}),
    logout: async () => {
      console.log('logout');
      await clearCredentials();
      setAPIAuthorization('');
      set({logged: false, loading: false, user: null});
    },
  },
}));
