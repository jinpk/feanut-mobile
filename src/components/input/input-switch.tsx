import React, {useRef, useState} from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput as RNTextInput,
  TextInput,
  TextInputChangeEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import colors from '../../libs/colors';
import {svgs} from '../../libs/images';
import {Text} from '../text';

type InputSwitchProps = {
  label: string;
  placeholder?: string;
  value?: string;
  onChagne?: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
};

export const InputSwitch = (props: InputSwitchProps): JSX.Element => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handlePress = () => {
    if (!editing) {
      setEditing(true);
      let tm = setTimeout(() => {
        inputRef.current?.focus();
        clearTimeout(tm);
      }, 300);
    } else {
      setEditing(false);
    }
  };

  return (
    <View>
      <Text mb={7} ml={13} color={colors.darkGrey} size={12}>
        {props.label}
      </Text>
      <View style={styles.root}>
        <RNTextInput
          ref={inputRef}
          onChange={props.onChagne}
          editable={editing}
          placeholderTextColor={colors.darkGrey}
          style={styles.input}
          value={props.value}
          placeholder={props.placeholder}
        />
        <TouchableOpacity onPress={handlePress} style={styles.clear}>
          <WithLocalSvg width={13} height={13} asset={svgs.pencil} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    backgroundColor: colors.lightGrey,
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
    paddingHorizontal: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
