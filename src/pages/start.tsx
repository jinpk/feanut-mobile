import React, {useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {configs} from '../libs/common/configs';
import StartTemplate from '../templates/start';
import {routes} from '../libs/common';
import {VerificationParams} from '../libs/interfaces';
import {
  useFriendStore,
  useHiddenFriendStore,
  useModalStore,
} from '../libs/stores';

function Start(): JSX.Element {
  const navigation = useNavigation();

  const openWebview = useModalStore(s => s.actions.openWebview);

  /** 스토어 초기화 */
  const clear1 = useFriendStore(s => s.actions.clear);
  const clear2 = useHiddenFriendStore(s => s.actions.clear);
  useEffect(() => {
    clear1();
    clear2();
  }, []);

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
