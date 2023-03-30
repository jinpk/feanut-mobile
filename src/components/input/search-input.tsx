import React, {LegacyRef} from 'react';
import {
  Image,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  ReturnKeyTypeOptions,
  StyleSheet,
  TextInput as RNTextInput,
  TextInputFocusEventData,
  View,
} from 'react-native';
import {colors, pngs} from '../../libs/common';

type SearchInputProps = {
  disabled?: boolean;

  value: string;
  onChange: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onFocus?: () => void;

  placeholder?: string;
  returnKeyType?: ReturnKeyTypeOptions;

  disabledAutoCapitalize?: boolean;
  secureTextEntry?: boolean;

  inputRef?: LegacyRef<RNTextInput>;

  disabledBorderBottom?: boolean;
  disabledBorderBottomRadius?: boolean;
  disabledBorderTopRadius?: boolean;

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

export const SearchInput = (props: SearchInputProps): JSX.Element => {
  return (
    <View
      style={[
        styles.root,
        {
          marginTop: props.mt,
          marginBottom: props.mb,
          marginHorizontal: props.mx,
          marginVertical: props.my,
          marginLeft: props.ml,
          marginRight: props.mr,
        },
      ]}>
      <Image source={pngs.magnifyingglass} style={styles.magnifyingglass} />
      <RNTextInput
        onFocus={props.onFocus}
        ref={props.inputRef}
        editable={props.disabled ? false : true}
        maxLength={props.maxLength}
        secureTextEntry={props.secureTextEntry}
        autoCapitalize={props.disabledAutoCapitalize ? 'none' : undefined}
        placeholderTextColor={colors.darkGrey}
        style={[styles.input]}
        placeholder={props.placeholder}
        value={props.value}
        onChangeText={props.onChange}
        onBlur={props.onBlur}
        returnKeyType={props.returnKeyType || 'done'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    borderRadius: 7,
    alignSelf: 'stretch',
    flexDirection: 'row',
    backgroundColor: colors.lightGrey,
  },
  input: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 7,
    fontSize: 14,
    color: colors.dark,
  },
  magnifyingglass: {
    width: 11,
    height: 11,
    resizeMode: 'contain',
    paddingVertical: 9,
    marginLeft: 7,
  },
});
