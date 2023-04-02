import React from 'react';
import {PropsWithChildren} from 'react';
import {View} from 'react-native';
import {colors} from '../../libs/common';

type TextMarketProps = PropsWithChildren<{
  color?: string;
  height?: string;
}>;

export const TextMarker = (props: TextMarketProps): JSX.Element => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <View
        style={{
          position: 'absolute',
          right: 0,
          borderRadius: 10,
          left: 0,
          backgroundColor: props.color || colors.yellow,
          opacity: 0.5,
          height: props.height || '100%',
          transform: [{rotate: '-3deg'}],
        }}
      />
      {props.children}
    </View>
  );
};
