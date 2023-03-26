import React from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet, View} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {colors, svgs} from '../libs/common';
import {Text} from './text';

type PrivacyProps = {
  text: string;

  mx?: number;
  mt?: number;
  my?: number;
};

export const Privacy = (props: PrivacyProps) => {
  return (
    <View
      style={[
        styles.root,
        {
          marginTop: props.mt,
          marginHorizontal: props.mx,
          marginVertical: props.my,
        },
      ]}>
      <WithLocalSvg
        asset={svgs.privacy}
        width={9}
        height={12}
        style={styles.icon}
      />
      <Text ml={7} size={12} color={colors.darkGrey}>
        {props.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
  },
  icon: {marginTop: 2},
});
