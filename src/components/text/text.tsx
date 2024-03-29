import React from 'react';
import {PropsWithChildren, useMemo} from 'react';
import {StyleProp, Text as RNText, TextStyle} from 'react-native';
import {colors, fonts} from '../../libs/common';

export type TextColorProps = string | undefined;
export type TextSizeProps =
  | 27
  | 18
  | 16
  | 14
  | 13
  | 12
  | 10
  | undefined
  | number;

type TextProps = PropsWithChildren<{
  color?: TextColorProps;
  style?: StyleProp<TextStyle>;
  size?: TextSizeProps;
  weight?: 'bold' | 'medium' | undefined;
  align?: 'center' | 'left' | 'right';
  mt?: number;
  mb?: number;
  my?: number;
  ml?: number;
  mx?: number;
  mr?: number;
  numberOfLines?: number | undefined;
  lineHeight?: number;
}>;

export const Text = (props: TextProps): JSX.Element => {
  const fontFamily = useMemo(() => {
    if (props.weight === 'bold') {
      return fonts.pretendard.bold;
    } else if (props.weight === 'medium') {
      return fonts.pretendard.semiBold;
    }
    return fonts.pretendard.medium;
  }, [props.weight]);

  return (
    <RNText
      numberOfLines={props.numberOfLines}
      style={[
        {
          fontFamily: fontFamily,
          fontSize: props.size || 14,
          color: props.color || colors.dark,
          lineHeight: props.lineHeight || (props.size || 14) * 1.193,
          marginTop: props.mt,
          marginBottom: props.mb,
          marginRight: props.mr,
          textAlign: props.align,
          marginVertical: props.my,
          marginLeft: props.ml,
          marginHorizontal: props.mx,
        },
        props.style,
      ]}>
      {props.children}
    </RNText>
  );
};
