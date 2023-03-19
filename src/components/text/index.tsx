import {PropsWithChildren} from 'react';
import {Text as RNText} from 'react-native';
import colors from '../../libs/colors';

type TextProps = PropsWithChildren<{
  color?: string | undefined;
  weight?: 'bold' | undefined;
  size?: 27 | 18 | 14 | 13 | 12 | undefined;
  mt?: number;
  mb?: number;
  my?: number;
}>;

export const Text = (props: TextProps): JSX.Element => {
  return (
    <RNText
      style={[
        {
          fontSize: props.size || 14,
          color: props.color || colors.dark,
          fontWeight: props.weight || 'normal',
          marginTop: props.mt,
          marginBottom: props.mb,
          marginVertical: props.my,
        },
      ]}>
      {props.children}
    </RNText>
  );
};
