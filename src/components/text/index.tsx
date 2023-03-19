import {PropsWithChildren} from 'react';
import {Text as RNText} from 'react-native/types';

type TextProps = PropsWithChildren<{
  color?: string | undefined;
  size?: 27 | 18 | 14 | 13 | 12 | undefined;
}>;

export const Text = (props: TextProps): JSX.Element => {
  return <RNText>{props.children}</RNText>;
};
