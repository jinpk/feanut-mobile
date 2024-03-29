import React, {LegacyRef} from 'react';
import {
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  StyleSheet,
  TextInput as RNTextInput,
  TextInputFocusEventData,
  ReturnKeyTypeOptions,
} from 'react-native';
import {colors, fonts} from '../../libs/common';

type LargeInputProps = {
  disabled?: boolean;

  value: string;
  onChange: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;

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
  px?: number;

  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  maxLength?: number;

  autoFocus?: boolean;

  textContentType?: 'oneTimeCode';
  autoComplete?: 'one-time-code';
};

export const LargeInput = (props: LargeInputProps): JSX.Element => {
  return (
    <RNTextInput
      autoFocus={props.autoFocus}
      keyboardType={props.keyboardType}
      ref={props.inputRef}
      editable={props.disabled ? false : true}
      secureTextEntry={props.secureTextEntry}
      maxLength={props.maxLength}
      returnKeyType={props.returnKeyType}
      onSubmitEditing={props.onSubmitEditing}
      autoCapitalize={props.disabledAutoCapitalize ? 'none' : undefined}
      placeholderTextColor={colors.mediumGrey}
      textContentType={props.textContentType}
      autoComplete={props.autoComplete }
      style={[
        styles.input,
        {
          marginTop: props.mt,
          marginBottom: props.mb,
          marginHorizontal: props.mx,
          paddingHorizontal: props.px,
          marginVertical: props.my,
          marginLeft: props.ml,
          marginRight: props.mr,
        },
      ]}
      placeholder={props.placeholder}
      value={props.value}
      onChangeText={props.onChange}
      onBlur={props.onBlur}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    fontFamily: fonts.pretendard.medium,
    fontSize: 27,
    color: colors.dark,
  },
});
