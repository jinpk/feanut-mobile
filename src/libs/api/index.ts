import * as axios from 'axios';
import {getCredentials, setCredentials} from '../common';
import {configs} from '../common/configs';
import {APIError, TokenResponse} from '../interfaces';
import {useUserStore} from '../stores';
import {postToken} from './auth';

export const feanutAPI = axios.default.create({
  baseURL: configs.apiBaseURL,
});

feanutAPI.interceptors.request.use(
  async function (config) {
    if (__DEV__) {
      console.log('NETWORK_REQUEST', config.url);
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

let isRefreshing = false;
// 리프레시 토큰 발급중일때 대기 큐
let failedQueue: {
  reject: (r: unknown) => void;
  resolve: (r: unknown) => void;
}[] = [];

const processQueue = (error: any, token: string) => {
  failedQueue.forEach(prom => {
    if (error) {
      // 큐 오류랑 실행되면 대기중인큐 전부 오류 처리
      prom.reject(error);
    } else {
      // 큐 새로운 토큰으로 실행되면 대기중인큐 전부 다시 호출
      prom.resolve(token);
    }
  });
  // 큐 초기화
  failedQueue = [];
};

// 리프레시 만료되면 콜했던 모든 API에서 어떻게 처리해야되는가?
// 오류 메시지를 보여주는게 맞는건가?
// 공통적으로 오류를 뺼수는 없는건가?
feanutAPI.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    // 요청실패
    if (!error.response) {
      return Promise.reject(error);
    }
    // 401 제외 오류 미들웨어
    if (error.response.status !== 401) {
      const wrappedError: APIError = {
        ...error.response.data,
        status: error.response.status,
        method: error.response.config.method,
        path: error.response.config.url,
      };
      if (!wrappedError.message) {
        wrappedError.message = '오류입니다.';
      }
      return Promise.reject(wrappedError);
    }

    /** 토큰 재발급 요청 */

    // 토큰 발급중일때 들어온 request 전부 큐에담고 후처리
    if (isRefreshing && !originalRequest._retry) {
      return new Promise((resolve, reject) => {
        failedQueue.push({resolve, reject});
      })
        .then(token => {
          // 큐 실행후 새로운 토큰과 트리거됨.
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return feanutAPI(originalRequest);
        })
        .catch(err => {
          // 큐 실행후 오류 트리거됨.
          // 로그아웃 처리는 first retry request에서 진행하니 필요 없음.
          return Promise.reject(err);
        });
    }
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // 토큰 자체가 없으면
      const credentials = await getCredentials();
      if (!credentials) {
        throw new Error(
          '인증 정보를 확인할 수 없습니다.\n다시 로그인해 주세요.',
        );
      }

      const token = credentials as TokenResponse;

      // 토큰 새로 발급
      const newToken = await postToken({
        refreshToken: token.refreshToken,
      });
      // 새로운 토큰으로 업데이트
      await setCredentials(newToken);
      setAPIAuthorization(newToken.accessToken);
      originalRequest.headers.Authorization = `Bearer ${newToken.accessToken}`;
      // 쌓였던 큐 전부 실행 with new Token
      processQueue(null, newToken.accessToken);
      // 첫번째 잡힌 API 실팽
      return feanutAPI(originalRequest);
    } catch (tokenError: any) {
      // 대기하던 큐 전부 call with error
      processQueue(tokenError, '');
      await useUserStore.getState().actions.logout();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

export const setAPIAuthorization = (accessToken: string) => {
  feanutAPI.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
};
