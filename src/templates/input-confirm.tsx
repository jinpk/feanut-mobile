import {ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '../components/button';
import {TextInput} from '../components/input';
import {Text} from '../components/text';
import colors from '../libs/common/colors';

type InputConfirmTemplateProps = {
  title: string;
  label: ReactNode | string;
  placeholder?: string;
  button?: string;
  message?: string;
  onConfirm: () => void;
};

function InputConfirmTemplate(props: InputConfirmTemplateProps): JSX.Element {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <Text weight="bold" size={18}>
        {props.title}
      </Text>
      <Text mt={30} mb={15}>
        {props.label}
      </Text>

      {Boolean(props.message) && (
        <Text size={12} color={colors.darkGrey} mb={15}>
          {props.message}
        </Text>
      )}

      <TextInput placeholder={props.placeholder} />

      <View style={[styles.absoluteButton, {marginBottom: insets.bottom}]}>
        <Button onPress={props.onConfirm} title={props.button || '확인'} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 16,
    paddingTop: 17,
    flex: 1,
  },
  absoluteButton: {
    position: 'absolute',
    bottom: 15,
    left: 16,
    right: 16,
  },
});

export default InputConfirmTemplate;
