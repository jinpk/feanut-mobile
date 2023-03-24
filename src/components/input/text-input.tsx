import React, {LegacyRef, useCallback} from 'react';
import {
  NativeSyntheticEvent,
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
  onBlur: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;

  placeholder?: string;

  disabledAutoCapitalize?: boolean;
  secureTextEntry?: boolean;

  onPressOut?: () => void;

  inputRef?: LegacyRef<RNTextInput>;

  disabledBorderBottom?: boolean;
  disabledBorderBottomRadius?: boolean;
  disabledBorderTopRadius?: boolean;
};

export const TextInput = (props: TextInputProps): JSX.Element => {
  const handleClear = useCallback(() => {
    props.onChange('');
  }, []);
  return (
    <View style={styles.root}>
      <View
        style={[
          styles.inputWrap,
          props.disabledBorderBottomRadius && styles.disabledBorderBottomRadius,
          props.disabledBorderTopRadius && styles.disabledBorderTopRadius,
          props.disabledBorderBottom && styles.disabledBorderBottom,
        ]}>
        <RNTextInput
          ref={props.inputRef}
          editable={props.disabled ? false : true}
          onPressOut={props.onPressOut}
          secureTextEntry={props.secureTextEntry}
          autoCapitalize={props.disabledAutoCapitalize ? 'none' : undefined}
          placeholderTextColor={colors.darkGrey}
          style={styles.input}
          placeholder={props.placeholder}
          value={props.value}
          onChangeText={props.onChange}
          onBlur={props.onBlur}
          returnKeyType="done"
        />
        {!props.disabled && (
          <TouchableOpacity style={styles.clear} onPress={handleClear}>
            <WithLocalSvg width={6} height={6} asset={svgs.close} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {},
  inputWrap: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.mediumGrey,
    borderRadius: 7,
    alignSelf: 'stretch',
    height: 43,
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 13,
    paddingBottom: 14,
    fontSize: 13,
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
