const WEBSITE_URL = 'https://feanut.com';

let apiBaseURL = 'https://api.feanut.com';
if (__DEV__) {
  apiBaseURL = 'https://api.dev.feanut.com';
  apiBaseURL = 'http://192.168.35.168:3000';
}

export const configs = {
  instagramClientId: '201156389218583',
  apiBaseURL,
  cdnBaseUrl: __DEV__ ? 'https://cdn.dev.feanut.com' : 'https://cdn.feanut.com',
  websiteUrl: WEBSITE_URL,
  privacyUrl: WEBSITE_URL + '/privacy',
  termsUrl: WEBSITE_URL + '/terms',
};
