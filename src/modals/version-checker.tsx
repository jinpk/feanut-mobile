import React, {useEffect, useRef, useState} from 'react';
import {Alert, AppState, Modal, View} from 'react-native';
import {configs} from '../libs/common/configs';
import {colors, constants} from '../libs/common';
import DeviceInfo from 'react-native-device-info';
import {Linking} from 'react-native';

export const VersionCheckerModal = (): JSX.Element => {
  const [visible, setVisible] = useState(false);

  const appState = useRef(AppState.currentState);

  const alertOpened = useRef(false);

  const checkVersion = () => {
    if (alertOpened.current) return;

    fetch(configs.verionUrl + '?os=' + constants.platform, {})
      .then(res => res.json())
      .then(data => {
        const {latestVersion, updateRequired, updateMessage} = data;

        const currentVersion = DeviceInfo.getVersion();

        if (currentVersion !== latestVersion) {
          if (updateRequired) {
            setVisible(true);
            alertOpened.current = true;
            Alert.alert('업데이트 안내', updateMessage, [
              {
                text: '업데이트 하러가기',
                isPreferred: true,
                onPress: () => {
                  alertOpened.current = false;
                  if (constants.platform === 'android') {
                    Linking.openURL(
                      `market://details?id=${'com.feanut.android'}`,
                    );
                  } else {
                    Linking.openURL(
                      `itms-apps://itunes.apple.com/app/id${'6446508324'}?mt=8`,
                    );
                  }
                },
              },
            ]);
          } else {
            setVisible(false);
          }
        } else {
          setVisible(false);
        }
      })
      .catch(e => {});
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        checkVersion();
      }

      appState.current = nextAppState;
    });

    checkVersion();

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <Modal transparent visible={visible}>
      <View style={{flex: 1, backgroundColor: colors.dark + '50'}} />
    </Modal>
  );
};
