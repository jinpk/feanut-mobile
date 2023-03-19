import {PropsWithChildren, useMemo, ReactNode} from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import colors from '../../libs/colors';
import {Text} from '../text';

type ButtonProps = PropsWithChildren<{
  title: string;
  color?: string;
  mt?: number;
  my?: number;
  mx?: number;

  onPress?: (e: GestureResponderEvent) => void;

  leftIcon?: ReactNode;
}>;

export const Button = (props: ButtonProps): JSX.Element => {
  const buttonStyle = useMemo((): ViewStyle => {
    return {
      backgroundColor: props.color || colors.primary,
      marginVertical: props.my,
      marginHorizontal: props.mx,
      marginTop: props.mt,
    };
  }, [props.color, props.mx, props.my, props.mt]);

  const textColor = useMemo(() => {
    if (
      [colors.dark, colors.primary, colors.black].includes(
        buttonStyle.backgroundColor as string,
      )
    ) {
      return colors.white;
    } else {
      colors.dark;
    }
  }, [buttonStyle.backgroundColor]);

  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.root, buttonStyle]}>
      {props.leftIcon && <View style={styles.leftIcon}>{props.leftIcon}</View>}
      <Text color={textColor}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    alignSelf: 'stretch',
    height: 42,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  leftIcon: {
    position: 'absolute',
    left: 17,
  },
});
