import React, {useEffect} from 'react';
import {
  Animated,
  GestureResponderEvent,
  StyleSheet,
  TouchableWithoutFeedback,
  useAnimatedValue,
  View,
} from 'react-native';
import {Avatar} from './avatar';
import {Text} from './text';
import {colors} from '../libs/common';
import {Source} from 'react-native-fast-image';

type PollFriendItemProps = {
  mb?: number;
  onPress?: (e: GestureResponderEvent) => void;
  selected?: boolean;
  color?: string;
  label: string;
  source: Source | number;
};

export function PollFriendItem(props: PollFriendItemProps): JSX.Element {
  const percentWidth = useAnimatedValue(0);
  useEffect(() => {
    if (!props.selected) {
      percentWidth.setValue(0);
    } else {
      const percent = 85;
      percentWidth.setValue(70);
      const toValue = ((175 - 70) / 100) * percent + 70;
      Animated.timing(percentWidth, {
        useNativeDriver: false,
        duration: 500,
        toValue,
      }).start(result => {
        if (!result.finished) {
          percentWidth.setValue(toValue);
        }
      });
    }
  }, [props.selected]);

  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View
        style={[
          styles.root,
          {marginBottom: props.mb},
          props.selected && {borderColor: props.color, borderWidth: 1},
        ]}>
        {props.selected && (
          <Animated.View
            style={[
              styles.precent,
              {
                backgroundColor: props.selected
                  ? props.color + 'CC'
                  : colors.mediumGrey + 'CC',
              },
              {width: percentWidth},
            ]}
          />
        )}
        <Avatar size={54} defaultLogo={'m'} />
        <View style={styles.content}>
          <Text numberOfLines={1}>{props.label}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: 35,
    backgroundColor: colors.white,
    padding: 8,
    width: 175,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    marginLeft: 15,

    flex: 1,
  },
  precent: {
    position: 'absolute',
    left: 0,
    borderRadius: 35,
    bottom: 0,
    top: 0,
  },
});
