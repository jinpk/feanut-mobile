import React from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import colors from '../../libs/colors';
import {svgs} from '../../libs/images';

type TextInputProps = {
  placeholder?: string;
  value?: string;
};

export const TextInput = (props: TextInputProps): JSX.Element => {
  return (
    <View style={styles.root}>
      <RNTextInput
        placeholderTextColor={colors.darkGrey}
        style={styles.input}
        placeholder={props.placeholder}
      />
      <TouchableOpacity style={styles.clear}>
        <WithLocalSvg width={6} height={6} asset={svgs.close} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
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
});
