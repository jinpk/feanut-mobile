import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WithLocalSvg} from 'react-native-svg';
import {svgs} from '../../libs/common';

export const MainTopBar = (): JSX.Element => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[styles.root, {paddingTop: insets.top + 10, paddingBottom: 10}]}>
      <WithLocalSvg width={67} height={35} asset={svgs.logoWithLetter} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    zIndex: 50,
    paddingBottom: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  optionItem: {
    paddingHorizontal: 15,
  },
});
