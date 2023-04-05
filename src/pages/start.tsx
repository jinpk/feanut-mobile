import React, {useCallback} from 'react';
import {Linking} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {configs} from '../libs/common/configs';
import StartTemplate from '../templates/start';
import {routes} from '../libs/common';
import {VerificationParams} from '../libs/interfaces';

function Start(): JSX.Element {
  const navigation = useNavigation();

  const handleLogin = useCallback(() => {
    const params: VerificationParams = {
      type: 'signin',
    };
    navigation.navigate(routes.verification, params);
  }, []);

  return (
    <StartTemplate
      onPrivacy={() => {
        Linking.openURL(configs.privacyUrl);
      }}
      onTerms={() => {
        Linking.openURL(configs.termsUrl);
      }}
      onStart={() => {
        navigation.navigate(routes.signup);
      }}
      onLogin={handleLogin}
    />
  );
}

export default Start;
