import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {colors} from '../libs/common';
import {Text, TextSizeProps} from './text';

type DataValue = any;

interface Data {
  label: string;
  value: DataValue;
}

type RadiosProps = {
  style?: StyleProp<ViewStyle>;
  value: DataValue;
  data: Data[];
  fontSize?: TextSizeProps;
  onChagne: (value: DataValue) => void;
};

export const Radios = (props: RadiosProps) => {
  return (
    <View style={[styles.root, props.style]}>
      {props.data.map((x, i) => {
        const selected = x.value === props.value;
        return (
          <TouchableOpacity
            onPress={() => {
              props.onChagne(x.value);
            }}
            key={i.toString()}
            style={styles.radioWrap}>
            <View style={styles.radio}>
              {selected && <View style={styles.radioSelected} />}
            </View>
            <Text
              ml={7}
              size={props.fontSize || 14}
              color={selected ? colors.black : colors.darkGrey}>
              {x.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
  },

  radioWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    borderRadius: 100,
    width: 17,
    height: 17,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderRadius: 100,
    width: 10.87,
    height: 10.87,
    backgroundColor: colors.primary,
  },
});
