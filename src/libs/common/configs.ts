import Config from 'react-native-config';

export const configs = {
  instagramClientId: '201156389218583',
  apiBaseURL:
    'http://192.168.237.99:3000' ||
    'http://172.30.1.55:3000' ||
    'http://172.30.1.20:3000' ||
    'http://192.168.0.7:3000' ||
    'http://192.168.110.99:3000' ||
    'http://192.168.0.8:3000' ||
    'https://api.dev.feanut.com' ||
    'http://192.168.0.8:3000' ||
    'https://api.dev.feanut.com' ||
    'http://192.168.142.99:3000' ||
    'http://35.216.45.248' ||
    'http://api.dev.feanut.com' ||
    Config.API_BASE_URL,
  cdnBaseUrl:
    'https://storage.googleapis.com/dev-cdn.feanut.com' ||
    'https://dev-cdn.feanut.com' ||
    Config.CDN_BASE_URL,

  websiteUrl: 'https://feanut.com',
  privacyUrl: 'https://feanut.com/privacy',
  termsUrl: 'https://feanut.com/terms',
};
