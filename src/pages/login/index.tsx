import {useNavigation} from '@react-navigation/native';
import React from 'react';
import routes from '../../libs/routes';
import {useUserStore} from '../../store';
import LoginTemplate from '../../templates/login';

function Login(): JSX.Element {
  const navigation = useNavigation();
  const login = useUserStore(state => state.actions.login);

  const handleKakaoLogin = () => {
    login();
  };
  const handleAppleLogin = () => {
    login();
  };
  const handleEmailLogin = () => {
    navigation.navigate(routes.loginEmail);
  };

  const handlePrivacyTerm = () => {};
  const handleServiceTerm = () => {};
  console.log('ha')

  return (
    <LoginTemplate
      onKakaoLogin={handleKakaoLogin}
      onAppleLogin={handleAppleLogin}
      onEmailLogin={handleEmailLogin}
      onPrivacyTerm={handlePrivacyTerm}
      onServiceTerm={handleServiceTerm}
    />
  );
}

export default Login;
