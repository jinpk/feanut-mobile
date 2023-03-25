import * as axios from 'axios';
import {getCredentials, isTokenExpired, setCredentials} from '../common';
import {configs} from '../common/configs';
import {TokenResponse} from '../interfaces';
import {useUserStore} from '../stores';
import {postToken} from './auth';

export const feanutAPI = axios.default.create({
  baseURL: configs.apiBaseURL,
});

feanutAPI.interceptors.request.use(
  async function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

feanutAPI.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    const credentials = await getCredentials();

    try {
      const token = credentials as TokenResponse;
      if (isTokenExpired(token.refreshToken)) {
        throw new Error('refresh token exipred.');
      }

      const newToken = await postToken({
        refreshToken: token.refreshToken,
      });

      await setCredentials(newToken);
      setAPIAuthorization(newToken.accessToken);
      // Set recalled api auth
      error.config.headers.Authorization = `Bearer ${newToken.accessToken}`;

      return feanutAPI(error.config);
    } catch (tokenError: any) {
      await useUserStore.getState().actions.logout();
      return Promise.reject(error);
    }
  },
);

export const setAPIAuthorization = (accessToken: string) => {
  feanutAPI.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
};
