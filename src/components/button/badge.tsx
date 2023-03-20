import {PropsWithChildren, useMemo} from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import colors from '../../libs/colors';
import {Text} from '../text';

type BadgeButtonProps = PropsWithChildren<{
  title: string;
  color?: string;
  mt?: number;
  my?: number;
  mx?: number;
  px?: number;

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
    };
  }, [props.disabled, props.color, props.mx, props.px, props.my, props.mt]);

  const textColor = useMemo(() => {
    if (buttonStyle.backgroundColor === colors.lightGrey) {
      return colors.blue;
    } else {
      return colors.white;
    }
  }, [buttonStyle.backgroundColor, props.disabled]);

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
    alignSelf: 'flex-start',
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
