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
import {colors, constants, gifs} from '../libs/common';
import {Source} from 'react-native-fast-image';
import {Gender} from '../libs/interfaces';
import {Gif} from './image';

type PollFriendItemProps = {
  mb?: number;
  onPress?: (e: GestureResponderEvent) => void;
  selected?: boolean;
  color?: string;
  gender?: Gender;
  label: string;
  source?: Source | number;

  isPull?: boolean;
};

const ITEM_WIDTH = constants.screenWidth * 0.4452;
const ITEM_HEIGHT = ITEM_WIDTH * 0.4;

export function PollFriendItem(props: PollFriendItemProps): JSX.Element {
  const percentWidth = useAnimatedValue(0);
  const scale = useAnimatedValue(0.9);
  const translateY = scale.interpolate({
    inputRange: [0.9, 1],
    outputRange: [20, 0],
  });

  useEffect(() => {
    scale.setValue(0.9);
    Animated.timing(scale, {
      duration: 300,
      toValue: 1,
      useNativeDriver: true,
    }).start(result => {
      if (!result.finished) {
        scale.setValue(1);
      }
    });
  }, []);

  useEffect(() => {
    if (!props.selected) {
      percentWidth.setValue(0);
    } else {
      const percent = props.isPull ? 100 : 85;
      percentWidth.setValue(ITEM_HEIGHT);
      const toValue =
        ((ITEM_WIDTH - ITEM_HEIGHT) / 100) * percent + ITEM_HEIGHT;
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
    <TouchableWithoutFeedback
      disabled={Boolean(props.isPull)}
      onPress={props.onPress}>
      <Animated.View
        style={[
          styles.root,
          {marginBottom: props.mb},
          {transform: [{scale}, {translateY}]},
          props.selected && {borderColor: props.color},
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
        <Avatar
          size={ITEM_WIDTH * 0.3142}
          source={props.source}
          defaultLogo={
            props.gender === 'female'
              ? 'w'
              : props.gender === 'male'
              ? 'm'
              : undefined
          }
        />
        <View style={styles.content}>
          <Text numberOfLines={1}>{props.label}</Text>
        </View>

        {props.isPull && !props.selected && (
          <View style={styles.unselectedWrapper} />
        )}
        {props.isPull && props.selected && (
          <View style={styles.selectedFinger}>
            <Gif source={gifs.backhand} />
          </View>
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: ITEM_WIDTH * 0.2,
    backgroundColor: colors.white,
    padding: ITEM_WIDTH * 0.0457,
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.white,
  },
  content: {
    marginLeft: 15,
    marginRight: 5,
    flex: 1,
  },
  precent: {
    position: 'absolute',
    left: 0,
    borderRadius: ITEM_WIDTH * 0.1828,
    bottom: 0,
    top: 0,
  },
  unselectedWrapper: {
    position: 'absolute',
    left: 0,
    borderRadius: ITEM_WIDTH * 0.1828,

    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 2,
    backgroundColor: colors.mediumGrey + 'CC',
  },
  selectedFinger: {position: 'absolute', right: 0, bottom: -15},
});
