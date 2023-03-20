import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {BackTopBar} from '../components/top-bar';
import colors from '../libs/colors';
import ProfileTemplate from '../templates/profile';

function Profile(): JSX.Element {
  const navigation = useNavigation();
  return (
    <View style={styles.root}>
      <BackTopBar logo onBack={navigation.goBack} />
      <ProfileTemplate />
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
