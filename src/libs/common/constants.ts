import {Dimensions, Platform} from 'react-native';

export const constants = {
  screenHeight: Dimensions.get('window').height,
  screenWidth: Dimensions.get('window').width,
  platform: Platform.OS,
  nameMaxLength: 6,

  statusMessageMaxLength: 50,

  phoneNumberMaxLength: 11,

  credentialsStorageKey: 'credentials',
  userStorageKey: 'user',

  genders: [
    {label: '여자', value: 'female'},
    {label: '남자', value: 'male'},
  ],
};
