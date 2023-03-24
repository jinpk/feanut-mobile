import {PropsWithChildren, useMemo} from 'react';
import {Text as RNText} from 'react-native';
import {colors, fonts} from '../../libs/common';

export type TextColorProps = string | undefined;
export type TextSizeProps = 27 | 18 | 14 | 13 | 12 | 10 | undefined;

type TextProps = PropsWithChildren<{
  color?: TextColorProps;
  size?: TextSizeProps;
  weight?: 'bold' | 'medium' | undefined;
  align?: 'center' | 'left' | 'right';
  mt?: number;
  mb?: number;
  my?: number;
  ml?: number;
  mx?: number;
}>;

export const Text = (props: TextProps): JSX.Element => {
  const fontFamily = useMemo(() => {
    if (props.weight === 'bold') {
      return fonts.pretendard.bold;
    } else if (props.weight === 'medium') {
      return fonts.pretendard.medium;
    }
    return fonts.pretendard.regular;
  }, [props.weight]);

  return (
    <RNText
      style={[
        {
          fontFamily: fontFamily,
          fontSize: props.size || 14,
          color: props.color || colors.dark,
          marginTop: props.mt,
          marginBottom: props.mb,
          textAlign: props.align,
          marginVertical: props.my,
          marginLeft: props.ml,
          marginHorizontal: props.mx,
        },
      ]}>
      {props.children}
    </RNText>
  );
};
