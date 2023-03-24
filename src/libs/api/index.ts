import * as axios from 'axios';
import {configs} from '../common/configs';

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
  function (error) {
    if (error.response.status === 401) {
      console.log('try once reissue accesstoken then');
      console.log('need to clear crenditials and store');
    }
    return Promise.reject(error);
  },
);

export const setAPIAuthorization = (accessToken: string) => {
  feanutAPI.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
};
