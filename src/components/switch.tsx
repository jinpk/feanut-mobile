import React from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import colors from '../libs/colors';

type SwitchProps = {};

function Switch(props: SwitchProps): JSX.Element {
  return (
    <View style={styles.root}>
      <Animated.View style={styles.ball} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: 14,
    backgroundColor: colors.mediumGrey,
    padding: 2,
    width: 33,
    height: 20,
  },
  ball: {
    backgroundColor: colors.white,
    width: 16,
    height: 16,
    borderRadius: 16,
  },
});

export default Switch;
