import {Dimensions, Platform} from 'react-native';

export const constants = {
  screenWidth: Dimensions.get('window').width,
  platform: Platform.OS,
  nameMaxLength: 10,

  usernameMinLength: 2,
  usernameMaxLength: 15,

  passwordMinLength: 6,
  passwordMaxLength: 20,

  phoneNumberMaxLength: 11,

  credentialsStorageKey: 'credentials',

  genders: [
    {label: '여자', value: 'female'},
    {label: '남자', value: 'male'},
  ],
};
