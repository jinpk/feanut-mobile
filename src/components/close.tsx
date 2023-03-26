import React from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {colors, svgs} from '../libs/common';

type CloseProps = {
  onClose: () => void;
  style: StyleProp<ViewStyle>;
};

export const Close = (props: CloseProps) => {
  return (
    <TouchableOpacity
      onPress={props.onClose}
      style={[styles.close, props.style]}>
      <WithLocalSvg asset={svgs.close} width={8.4} height={8.4} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  close: {
    width: 21,
    height: 21,
    borderRadius: 100,
    backgroundColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
});
