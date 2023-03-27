import * as axios from 'axios';
import {getCredentials, isTokenExpired, setCredentials} from '../common';
import {configs} from '../common/configs';
import {APIError, TokenResponse} from '../interfaces';
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
    if (!error.response) {
      return Promise.reject(error);
    } else if (error.response.status !== 401) {
      const wrappedError: APIError = {
        ...error.response.data,
        status: error.response.status,
      };

      if (!wrappedError.message) {
        wrappedError.message = '오류입니다.';
      }
      return Promise.reject(wrappedError);
    }

    const credentials = await getCredentials();

    if (!credentials) {
      return Promise.reject(error);
    }

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
      console.log(tokenError);
      await useUserStore.getState().actions.logout();
      return Promise.reject(error);
    }
  },
);

export const setAPIAuthorization = (accessToken: string) => {
  feanutAPI.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
};
