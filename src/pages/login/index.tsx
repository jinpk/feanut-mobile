import {useNavigation} from '@react-navigation/native';
import React from 'react';
import routes from '../../libs/routes';
import LoginTemplate from '../../templates/login';

function Login(): JSX.Element {
  const navigation = useNavigation();

  const handleKakaoLogin = () => {
    navigation.reset({index: 0, routes: [{name: routes.welcome}]});
  };
  const handleAppleLogin = () => {
    navigation.reset({index: 0, routes: [{name: routes.welcome}]});
  };
  const handleEmailLogin = () => {
    navigation.navigate(routes.loginEmail);
  };

  const handlePrivacyTerm = () => {};
  const handleServiceTerm = () => {};

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
