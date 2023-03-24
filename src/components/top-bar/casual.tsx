import React from 'react';
import {StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import LogoSvg from '../../assets/svgs/logo.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {svgs, colors} from '../../libs/common';

type CasualTopBarProps = {
  onClose?: () => void;
};

export const CasualTopBar = (props: CasualTopBarProps): JSX.Element => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, {paddingTop: insets.top + 16}]}>
      <StatusBar barStyle="dark-content" />
      {props.onClose && (
        <TouchableOpacity
          onPress={props.onClose}
          style={[styles.close, {marginTop: insets.top}]}>
          <WithLocalSvg width={14} height={14} asset={svgs.close} />
        </TouchableOpacity>
      )}
      <WithLocalSvg width={58} height={30} asset={LogoSvg} />
      <WithLocalSvg
        width={76}
        height={20}
        fill={colors.dark}
        asset={svgs.logoLetterBlack}
        style={styles.letter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  letter: {
    marginTop: 9,
  },
  close: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 16,
  },
});
