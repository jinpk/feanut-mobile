import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {configs} from '../libs/common/configs';
import StartTemplate from '../templates/start';
import {routes} from '../libs/common';
import {VerificationParams} from '../libs/interfaces';
import {useModalStore} from '../libs/stores';

function Start(): JSX.Element {
  const navigation = useNavigation();

  const openWebview = useModalStore(s => s.actions.openWebview);

  const handleLogin = useCallback(() => {
    const params: VerificationParams = {
      type: 'signin',
    };
    navigation.navigate(routes.verification, params);
  }, []);

  const handleSignUp = useCallback(() => {
    const params: VerificationParams = {
      type: 'signup',
    };
    navigation.navigate(routes.verification, params);
  }, []);

  return (
    <StartTemplate
      onPrivacy={() => {
        openWebview(configs.privacyUrl);
      }}
      onTerms={() => {
        openWebview(configs.termsUrl);
      }}
      onStart={handleSignUp}
      onLogin={handleLogin}
    />
  );
}

export default Start;
