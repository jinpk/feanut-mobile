import React, {LegacyRef, useCallback} from 'react';
import {
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  StyleSheet,
  TextInput as RNTextInput,
  TextInputFocusEventData,
  View,
} from 'react-native';
import {colors} from '../../libs/common';

type LineInputProps = {
  disabled?: boolean;

  value: string;
  onChange: (text: string) => void;
  onBlur: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;

  placeholder?: string;

  disabledAutoCapitalize?: boolean;
  secureTextEntry?: boolean;


  inputRef?: LegacyRef<RNTextInput>;

  mt?: number;
  mb?: number;
  my?: number;
  mx?: number;
  ml?: number;
  mr?: number;

  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;

  autoFocus?: boolean;
};

export const LineInput = (props: LineInputProps): JSX.Element => {
  return (
    <RNTextInput
      ref={props.inputRef}
      editable={props.disabled ? false : true}
      maxLength={props.maxLength}
      secureTextEntry={props.secureTextEntry}
      autoCapitalize={props.disabledAutoCapitalize ? 'none' : undefined}
      placeholderTextColor={colors.darkGrey}
      style={[
        styles.input,
        {
          marginTop: props.mt,
          marginBottom: props.mb,
          marginHorizontal: props.mx,
          marginVertical: props.my,
          marginLeft: props.ml,
          marginRight: props.mr,
        },
      ]}
      placeholder={props.placeholder}
      value={props.value}
      onChangeText={props.onChange}
      onBlur={props.onBlur}
      returnKeyType="done"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 7,
    fontSize: 14,
    color: colors.dark,
    borderBottomWidth: 0.5,
    borderColor: colors.mediumGrey,
  },
});
