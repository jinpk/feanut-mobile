import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {BackTopBar} from '../components/top-bar';
import colors from '../libs/colors';
import InboxTemplate from '../templates/inbox';

function Inbox(): JSX.Element {
  const navigation = useNavigation();
  return (
    <View style={styles.root}>
      <BackTopBar logo onBack={navigation.goBack} />
      <InboxTemplate />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.white},
});

export default Inbox;
