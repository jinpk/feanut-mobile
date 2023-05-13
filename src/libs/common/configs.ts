const WEBSITE_URL = 'https://feanut.com';

const isLocal = true;
const localHost = 'http://172.29.105.220:3000';

const PRODUCTION_MODE = false;

let apiBaseURL = 'https://api.feanut.com';
if (__DEV__ || !PRODUCTION_MODE) {
  apiBaseURL = 'https://api.dev.feanut.com';
  if (isLocal) {
    apiBaseURL = localHost;
  }
}

let cdnBaseUrl = 'https://cdn.feanut.com';
if (__DEV__ || !PRODUCTION_MODE) {
  cdnBaseUrl = 'https://cdn.dev.feanut.com';
}

const verionUrl =
  'https://asia-northeast3-feanut.cloudfunctions.net/feanut-apps-version';

const assetBaseUrl = 'https://storage.googleapis.com/assets.feanut.com';

export const configs = {
  instagramClientId: '201156389218583',

  apiBaseURL,
  cdnBaseUrl,
  assetBaseUrl,
  verionUrl,
  isProduction: PRODUCTION_MODE,
  websiteUrl: WEBSITE_URL,
  privacyUrl: WEBSITE_URL + '/privacy',
  termsUrl: WEBSITE_URL + '/terms',

  referralLinkUrl: WEBSITE_URL + '/referral',
  referralLinkUserIdKey: 'referral_user_id',
};
