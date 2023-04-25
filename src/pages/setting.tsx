import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Linking} from 'react-native';
import SettingTemplate from '../templates/setting';
import {getMe} from '../libs/api/users';
import {useModalStore, useUserStore} from '../libs/stores';
import {configs} from '../libs/common/configs';
import {routes} from '../libs/common';
import {useNavigation} from '@react-navigation/native';
import {useNotificationUserConfig} from '../hooks';

export default function Setting() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const notificationUserConfig = useNotificationUserConfig();

  const navigation = useNavigation();
  const openWebview = useModalStore(s => s.actions.openWebview);
  const logout = useUserStore(s => s.actions.logout);

  useEffect(() => {
    getMe().then(user => {
      setPhoneNumber(user.phoneNumber);
    });
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert('로그아웃 하시겠습니까?', '', [
      {text: '취소', style: 'cancel'},
      {
        text: '확인',
        onPress: () => {
          logout(true);
        },
      },
    ]);
  }, []);

  const handleService = useCallback(() => {
    Linking.openURL(configs.websiteUrl);
  }, []);

  const handlePrivacy = useCallback(() => {
    openWebview(configs.privacyUrl);
  }, []);

  const handleTerms = useCallback(() => {
    openWebview(configs.termsUrl);
  }, []);

  const handleWithdrawal = useCallback(() => {
    navigation.navigate(routes.deleteMe);
  }, []);

  return (
    <SettingTemplate
      onBack={navigation.goBack}
      phoneNumber={phoneNumber}
      onLogout={handleLogout}
      onWithdrawal={handleWithdrawal}
      onService={handleService}
      onTerms={handleTerms}
      onPrivacy={handlePrivacy}
      receivePull={notificationUserConfig.config.receivePull}
      receivePoll={notificationUserConfig.config.receivePoll}
      onReceivePoll={notificationUserConfig.changePoll}
      onReceivePull={notificationUserConfig.changePull}
    />
  );
}
