import {ActionSheetIOS, Alert, PermissionsAndroid} from 'react-native';
import {constants} from '../libs/common';
import {Asset, launchImageLibrary} from 'react-native-image-picker';

export function useProfileImage() {
  const handleOpenOptions = (cb: (asset: Asset | null) => void) => {
    if (constants.platform === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['취소', '앨범에서 사진 선택', '기본 이미지로 변경'],
          cancelButtonIndex: 0,
          userInterfaceStyle: 'light',
        },
        buttonIndex => {
          if (buttonIndex === 0) {
            // cancel action
          } else if (buttonIndex === 1) {
            launchImageLibrary({
              mediaType: 'photo',
              quality: 0.5,
            }).then(response => {
              if (response.didCancel) {
                return;
              }
              if (response.errorMessage) {
                Alert.alert(response.errorMessage);
                return;
              }
              if (!response.assets) return;

              const file = response.assets[0];
              cb(file);
            });
          } else if (buttonIndex === 2) {
            cb(null);
          }
        },
      );
    } else {
      launchImageLibrary({
        mediaType: 'photo',
        quality: 0.5,
      }).then(response => {
        if (response.didCancel) {
          return;
        }
        if (response.errorMessage) {
          Alert.alert(response.errorMessage);
          return;
        }
        if (!response.assets) return;

        const file = response.assets[0];
        cb(file);
      });
    }
  };

  return {
    open: handleOpenOptions,
  };
}
