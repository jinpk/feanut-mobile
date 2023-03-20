import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {CasualTopBar} from '../../components/top-bar';
import colors from '../../libs/colors';
import routes from '../../libs/routes';
import {useModalStore, useUserStore} from '../../store';
import LoginTemplate from '../../templates/login';

function Login(): JSX.Element {
  const navigation = useNavigation();
  const login = useUserStore(state => state.actions.login);
  const openWelcome = useModalStore(s => s.actions.openWelcome);

  const handleKakaoLogin = () => {
    login();
    openWelcome();
  };
  const handleAppleLogin = () => {
    login();
    openWelcome();
  };
  const handleEmailLogin = () => {
    navigation.navigate(routes.loginEmail);
  };

  const handlePrivacyTerm = () => {};
  const handleServiceTerm = () => {};

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <CasualTopBar />
      <LoginTemplate
        onKakaoLogin={handleKakaoLogin}
        onAppleLogin={handleAppleLogin}
        onEmailLogin={handleEmailLogin}
        onPrivacyTerm={handlePrivacyTerm}
        onServiceTerm={handleServiceTerm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.white},
});

export default Login;
