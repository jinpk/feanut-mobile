import React, {LegacyRef, useCallback} from 'react';
import {
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  ReturnKeyTypeOptions,
  StyleSheet,
  TextInput as RNTextInput,
  TextInputFocusEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {svgs, colors} from '../../libs/common';

type TextInputProps = {
  disabled?: boolean;

  value: string;
  onChange: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;

  placeholder?: string;
  returnKeyType?: ReturnKeyTypeOptions;

  disabledAutoCapitalize?: boolean;
  secureTextEntry?: boolean;

  onPress?: () => void;

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

  hiddenClose?: boolean;

  onSubmitEditing?: () => void;
};

export const TextInput = (props: TextInputProps): JSX.Element => {
  const handleClear = useCallback(() => {
    props.onChange('');
  }, []);
  return (
    <View
      style={[
        styles.inputWrap,
        props.disabledBorderBottomRadius && styles.disabledBorderBottomRadius,
        props.disabledBorderTopRadius && styles.disabledBorderTopRadius,
        props.disabledBorderBottom && styles.disabledBorderBottom,
        {
          marginTop: props.mt,
          marginBottom: props.mb,
          marginHorizontal: props.mx,
          marginVertical: props.my,
          marginLeft: props.ml,
          marginRight: props.mr,
        },
      ]}>
      <RNTextInput
        onPressOut={props.onPress}
        ref={props.inputRef}
        editable={props.disabled ? false : true}
        maxLength={props.maxLength}
        secureTextEntry={props.secureTextEntry}
        autoCapitalize={props.disabledAutoCapitalize ? 'none' : undefined}
        placeholderTextColor={colors.darkGrey}
        style={[styles.input]}
        placeholder={props.placeholder}
        value={props.value}
        onSubmitEditing={props.onSubmitEditing}
        onChangeText={props.onChange}
        onBlur={props.onBlur}
        returnKeyType={props.returnKeyType || 'done'}
      />
      {!props.disabled && !props.hiddenClose && (
        <TouchableOpacity style={styles.clear} onPress={handleClear}>
          <WithLocalSvg
            width={6}
            height={6}
            asset={svgs.close}
            color={colors.darkGrey}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrap: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.mediumGrey,
    borderRadius: 7,
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 13,
    paddingBottom: 14,
    fontSize: 14,
    color: colors.dark,
  },
  clear: {
    marginRight: 16,
    borderRadius: 100,
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mediumGrey,
  },

  disabledBorderBottomRadius: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  disabledBorderTopRadius: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  disabledBorderBottom: {borderBottomWidth: 0},
});
