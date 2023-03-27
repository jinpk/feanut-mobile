import React, {useEffect, useMemo} from 'react';
import {
  Animated,
  GestureResponderEvent,
  ImageSourcePropType,
  StyleSheet,
  TouchableNativeFeedback,
  useAnimatedValue,
  View,
} from 'react-native';
import {Avatar} from './avatar';
import {Text} from './text';
import {colors} from '../libs/common';

type PollFriendItemProps = {
  mb?: number;
  onPress?: (e: GestureResponderEvent) => void;
  selected?: boolean;
  percent?: number;
  color?: string;
};

export function PollFriendItem(props: PollFriendItemProps): JSX.Element {
  const percentWidth = useAnimatedValue(0);
  const source = useMemo((): ImageSourcePropType | undefined => {
    if (Math.floor(Math.random() * 100) > 50) {
      return undefined;
    }
    return {
      uri: 'https://t3.ftcdn.net/jpg/02/36/48/86/360_F_236488644_opXVvD367vGJTM2I7xTlsHB58DVbmtxR.jpg',
    };
  }, []);

  useEffect(() => {
    if (!props.percent) {
      percentWidth.setValue(0);
      return;
    }

    percentWidth.setValue(70);
    const toValue = ((175 - 70) / 100) * props.percent + 70;
    Animated.timing(percentWidth, {
      useNativeDriver: false,
      duration: 500,
      toValue,
    }).start(result => {
      if (!result.finished) {
        percentWidth.setValue(toValue);
      }
    });
  }, [props.percent]);

  return (
    <TouchableNativeFeedback
      onPressIn={e => {
        console.log('hi');
      }}
      onPress={props.onPress}>
      <View
        style={[
          styles.root,
          {marginBottom: props.mb},
          props.selected && styles.shadow,
          props.selected && {borderWidth: 1.5, borderColor: colors.dark},
        ]}>
        {props.percent && (
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
        // source={source}
         size={54} defaultLogo={'m'} />
        <View style={styles.content}>
          <Text>피넛유저</Text>
        </View>
      </View>
    </TouchableNativeFeedback>
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
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    marginLeft: 20,
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
