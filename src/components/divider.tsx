import React from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../libs/common';

type DividerProps = {
  my?: number;
  mx?: number;
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
};

export function Divider(props: DividerProps): JSX.Element {
  return (
    <View
      style={[
        styles.root,
        {marginHorizontal: props.mx},
        {marginVertical: props.my},

        {marginTop: props.mt},
        {marginBottom: props.mb},
        {marginRight: props.mr},
        {marginLeft: props.ml},
      ]}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'stretch',
    height: 0.5,
    borderRadius: 5,
    backgroundColor: colors.mediumGrey,
  },
});
