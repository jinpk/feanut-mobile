import React from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {Dimensions, StyleSheet, View} from 'react-native';
import {colors} from '../libs/common';
import {Text} from './text';

dayjs.extend(duration);

type TimerProps = {
  maxSecond: number;
  second: number;
};

let width = Dimensions.get('window').width * 0.6;
if (width > 250) {
  width = 250;
}
let height = width;

export const Timer = (props: TimerProps): JSX.Element => {
  return (
    <View style={styles.root}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text weight="bold" size={27}>
          23:33
        </Text>
      </View>

      <View style={styles.indicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: colors.mediumGrey,
    borderWidth: 7,
    width,
    height,
    borderRadius: width / 2,
  },
  indicator: {
    position: 'absolute',
    width,
    height,
    borderRadius: width / 2,
    borderTopColor: colors.primary,
    borderRightColor: colors.primary,
    borderWidth: 7,
    borderBottomColor: colors.transparent,
    borderLeftColor: colors.transparent,
    transform: [{rotate: '45deg'}],
  },
});
