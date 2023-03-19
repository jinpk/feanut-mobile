import {PropsWithChildren} from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import colors from '../../libs/colors';
import {Text} from '../text';

type TextButtonProps = PropsWithChildren<{
  title: string;
  onPress?: (e: GestureResponderEvent) => void;
}>;

export const TextButton = (props: TextButtonProps): JSX.Element => {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.root}>
      <Text size={12} color={colors.blue}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    borderBottomWidth: 1,
    borderBottomColor: colors.blue,
  },
});
