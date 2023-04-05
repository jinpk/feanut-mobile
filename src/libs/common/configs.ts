const WEBSITE_URL = 'https://feanut.com';

export const configs = {
  instagramClientId: '201156389218583',
  apiBaseURL: __DEV__ ? 'https://api.dev.feanut.com' : 'https://api.feanut.com',
  cdnBaseUrl: __DEV__ ? 'https://cdn.dev.feanut.com' : 'https://cdn.feanut.com',
  websiteUrl: WEBSITE_URL,
  privacyUrl: WEBSITE_URL + '/privacy',
  termsUrl: WEBSITE_URL + '/terms',
};
