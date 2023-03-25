import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {BackTopBar} from '../components/top-bar';
import {getMyProfile} from '../libs/api/profile';
import {colors} from '../libs/common';
import {Profile as ProfileI} from '../libs/interfaces';
import {useUserStore} from '../libs/stores';
import ProfileTemplate from '../templates/profile';

function Profile(): JSX.Element {
  const navigation = useNavigation();
  const username = useUserStore(s => s.user?.username);
  const logout = useUserStore(s => s.actions.logout);
  const focused = useIsFocused();
  const [profile, setProfile] = useState<ProfileI | undefined>(undefined);

  const fetchMyProfile = async () => {
    try {
      const profile = await getMyProfile();
      return profile;
    } catch (error: any) {
      Alert.alert(error.message || error);
    }
  };

  useEffect(() => {
    if (!focused) return;

    fetchMyProfile().then(setProfile);
  }, [focused]);

  return (
    <View style={styles.root}>
      <BackTopBar title={username} onBack={navigation.goBack} />
      {Boolean(profile) && (
        <ProfileTemplate profile={profile} onLogout={logout} />
      )}
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
