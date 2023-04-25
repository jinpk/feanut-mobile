import {PropsWithChildren, useMemo} from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {colors} from '../../libs/common';
import {Text, TextColorProps, TextSizeProps} from '../text';

type TextButtonProps = PropsWithChildren<{
  title: string;
  fontSize?: TextSizeProps;
  color?: TextColorProps;
  hiddenBorder?: boolean;
  onPress?: (e: GestureResponderEvent) => void;
  rightIcon?: JSX.Element;
  style?: ViewStyle;
}>;

export const TextButton = (props: TextButtonProps): JSX.Element => {
  const color = useMemo(() => {
    return props.color || colors.blue;
  }, [props.color]);
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[
        styles.root,
        {
          borderBottomColor: color,
          borderBottomWidth: props.hiddenBorder ? 0 : 1,
        },
        props.style,
      ]}>
      <Text size={props.fontSize || 12} color={color}>
        {props.title}
      </Text>
      {props.rightIcon && (
        <View style={styles.rightIcon}>{props.rightIcon}</View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.blue,
  },
  rightIcon: {
    marginLeft: 3,
  },
});
