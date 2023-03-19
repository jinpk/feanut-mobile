import {PropsWithChildren, useMemo} from 'react';
import {Text as RNText} from 'react-native';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';

type TextProps = PropsWithChildren<{
  color?: string | undefined;
  weight?: 'bold' | 'medium' | undefined;
  size?: 27 | 18 | 14 | 13 | 12 | undefined;
  mt?: number;
  mb?: number;
  my?: number;
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
          marginVertical: props.my,
        },
      ]}>
      {props.children}
    </RNText>
  );
};
