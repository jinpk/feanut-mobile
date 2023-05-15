import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {colors, svgs} from '../libs/common';
import {Text} from './text';
import {WithLocalSvg} from 'react-native-svg';

type FeanutCoinProps = {
  onPress: () => void;
  amount: number;
};

export const FeanutCoin = (props: FeanutCoinProps) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.root}>
      <View style={styles.content}>
        <Text color={colors.primary} size={10} mt={3} weight="medium">
          버터
        </Text>
        <Text color={colors.primary} size={16} weight="medium">
          {props.amount}
        </Text>
      </View>
      <WithLocalSvg
        asset={svgs.add}
        width={24}
        height={24}
        style={styles.add}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    alignSelf: 'center',
    backgroundColor: colors.primaryHighlight,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {justifyContent: 'center', alignItems: 'center', marginLeft: 20},
  add: {
    margin: 8,
  },
});
