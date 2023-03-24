import {Dimensions} from 'react-native';

export const constants = {
  screenWidth: Dimensions.get('window').width,

  usernameMinLength: 2,
  usernameMaxLength: 15,

  passwordMinLength: 6,
  passwordMaxLength: 20,

  credentialsStorageKey: 'credentials',
};
