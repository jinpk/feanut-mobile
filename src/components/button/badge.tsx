import {PropsWithChildren, useMemo} from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {colors} from '../../libs/common';
import {Text} from '../text';

type BadgeButtonProps = PropsWithChildren<{
  title: string;
  color?: string;
  fontColor?: string;
  mt?: number;
  my?: number;
  mx?: number;
  px?: number;

  alignSelf?: 'center';

  onPress?: (e: GestureResponderEvent) => void;
  disabled?: boolean;
}>;

export const BadgeButton = (props: BadgeButtonProps): JSX.Element => {
  const buttonStyle = useMemo((): ViewStyle => {
    return {
      backgroundColor: props.color || colors.lightGrey,
      marginVertical: props.my,
      marginHorizontal: props.mx,
      paddingHorizontal: props.px,
      marginTop: props.mt,
      alignSelf: props.alignSelf || 'flex-start',
    };
  }, [
    props.disabled,
    props.color,
    props.mx,
    props.px,
    props.my,
    props.mt,
    props.alignSelf,
  ]);

  const textColor = useMemo(() => {
    if (props.fontColor) return props.fontColor;
    if (buttonStyle.backgroundColor === colors.lightGrey) {
      return colors.blue;
    } else {
      return colors.white;
    }
  }, [buttonStyle.backgroundColor, props.disabled, props.fontColor]);

  return (
    <TouchableOpacity
      disabled={props.disabled}
      onPress={props.onPress}
      style={[styles.root, buttonStyle]}>
      <Text color={textColor} size={12} weight="medium">
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    height: 24,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
