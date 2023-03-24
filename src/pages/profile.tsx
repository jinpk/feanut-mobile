import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {BackTopBar} from '../components/top-bar';
import {colors} from '../libs/common';
import {useUserStore} from '../libs/stores';
import ProfileTemplate from '../templates/profile';

function Profile(): JSX.Element {
  const navigation = useNavigation();
  const logout = useUserStore(s => s.actions.logout);
  return (
    <View style={styles.root}>
      <BackTopBar logo onBack={navigation.goBack} />
      <ProfileTemplate onLogout={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
export default Profile;
