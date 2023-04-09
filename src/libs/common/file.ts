import {configs} from './configs';

type ThumbSizes = '150' | '70';

export const getObjectURLByKey = (key?: string, size?: ThumbSizes) => {
  if (!key) return '';
  let path = key;
  if (size) {
    path = `thumb@${size}_` + path;
  }
  return configs.cdnBaseUrl + '/' + path;
};
