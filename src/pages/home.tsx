import React from 'react';
import {StyleSheet, View} from 'react-native';
import {MainTopBar} from '../components/top-bar/main';

function Home(): JSX.Element {
  return (
    <View style={[styles.root]}>
      <MainTopBar onInboxPress={() => {}} onProfilePress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
});

export default Home;
