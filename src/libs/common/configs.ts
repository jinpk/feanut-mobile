const WEBSITE_URL = 'https://feanut.com';

let apiBaseURL = 'https://api.feanut.com';
if (__DEV__) {
  apiBaseURL = 'https://api.dev.feanut.com';
} else {
  // apiBaseURL = 'https://api.dev.feanut.com';
}

let cdnBaseUrl = 'https://cdn.feanut.com';
if (__DEV__) {
  cdnBaseUrl = 'https://cdn.dev.feanut.com';
} else {
  // cdnBaseUrl = 'https://cdn.dev.feanut.com';
}

let verionUrl =
  'https://asia-northeast3-feanut.cloudfunctions.net/feanut-apps-version';
if (__DEV__) {
  // verionUrl = 'https://cdn.dev.feanut.com';
} else {
  // verionUrl = 'https://cdn.dev.feanut.com';
}

const assetBaseUrl = 'https://storage.googleapis.com/assets.feanut.com';

export const configs = {
  instagramClientId: '201156389218583',

  apiBaseURL,
  cdnBaseUrl,
  assetBaseUrl,
  verionUrl,

  websiteUrl: WEBSITE_URL,
  privacyUrl: WEBSITE_URL + '/privacy',
  termsUrl: WEBSITE_URL + '/terms',
};
