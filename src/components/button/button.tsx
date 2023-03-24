import {PropsWithChildren, useMemo, ReactNode} from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {colors} from '../../libs/common';
import {Text} from '../text';

type ButtonProps = PropsWithChildren<{
  title: string;
  color?: string;
  mt?: number;
  my?: number;
  mx?: number;
  px?: number;
  mb? :number;

  alignSelf?: 'stretch' | 'center';
  radius?: 's' | 'm';

  onPress?: (e: GestureResponderEvent) => void;
  disabled?: boolean;

  leftIcon?: ReactNode;
}>;

export const Button = (props: ButtonProps): JSX.Element => {
  const buttonStyle = useMemo((): ViewStyle => {
    return {
      backgroundColor: props.disabled
        ? colors.mediumGrey
        : props.color || colors.primary,
      marginVertical: props.my,
      marginHorizontal: props.mx,
      paddingHorizontal: props.px,
      marginTop: props.mt,
      marginBottom: props.mb,
      borderRadius: props.radius === 'm' ? 21 : 7,
      alignSelf: props.alignSelf || 'stretch',
    };
  }, [
    props.disabled,
    props.color,
    props.radius,
    props.mx,
    props.px,
    props.mb,
    props.my,
    props.mt,
    props.alignSelf,
  ]);

  const textColor = useMemo(() => {
    if (buttonStyle.backgroundColor === colors.lightGrey) {
      return colors.red;
    }
    if (props.disabled) {
      return colors.darkGrey;
    }
    if (
      [colors.dark, colors.primary, colors.black].includes(
        buttonStyle.backgroundColor as string,
      )
    ) {
      return colors.white;
    } else {
      colors.dark;
    }
  }, [buttonStyle.backgroundColor, props.disabled]);

  return (
    <TouchableOpacity
      disabled={props.disabled}
      onPress={props.onPress}
      style={[styles.root, buttonStyle]}>
      {props.leftIcon && <View style={styles.leftIcon}>{props.leftIcon}</View>}
      <Text color={textColor}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  leftIcon: {
    position: 'absolute',
    left: 17,
  },
});
