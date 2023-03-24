import {PropsWithChildren} from 'react';
import {View} from 'react-native';
import colors from '../../libs/common/colors';

type TextMarketProps = PropsWithChildren<{}>;

export const TextMarker = (props: TextMarketProps): JSX.Element => {
  return (
    <View>
      <View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          borderRadius: 10,
          left: 0,
          backgroundColor: colors.yellow,
          opacity: 0.5,
          transform: [{rotate: '-3deg'}],
        }}
      />
      {props.children}
    </View>
  );
};
