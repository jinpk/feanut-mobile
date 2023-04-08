import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WithLocalSvg} from 'react-native-svg';
import {
  colors,
  constants,
  emotionBackgorundColor,
  emotionPointColor,
  emotions,
  svgs,
} from '../../libs/common';
import {PollingFriendItem} from '../../libs/interfaces/polling';
import {PollFriendItem} from '../poll-friend-item';
import {Text} from '../text';
import {Feanut, Figure, PollLayout} from './layout';
import {Animated} from 'react-native';

type PollingProps = {
  style?: ViewStyle;

  emotion: emotions;
  title: string;
  iconURI: string;
  friends: PollingFriendItem[];
  selectedFriend?: string;
  onShuffle: () => void;
  onSkip: () => void;
  onSelected: (value: string) => void;

  readyToFocus: boolean;
  focused: boolean;

  onNext: () => Promise<boolean>;
};

export const Polling = (props: PollingProps) => {
  const insets = useSafeAreaInsets();
  const handleFriendSelect =
    (friend: PollingFriendItem) => (e: GestureResponderEvent) => {
      props.onSelected(friend.value);
    };
  const pointColor = useMemo(() => {
    return emotionPointColor[props.emotion];
  }, [props.emotion]);

  const translateX = useRef(new Animated.Value(0)).current;
  const translateXValue = useRef(0);

  const isSelectedStore = useRef(false);
  useEffect(() => {
    isSelectedStore.current = props.selectedFriend ? true : false;
  }, [props.selectedFriend]);
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (e, gestureState) => {
        const {dx, dy} = gestureState;
        // 10 이하 무조건 터치
        if (Math.abs(dx) < 3 && Math.abs(dy) < 10) {
          e.stopPropagation();
          return false;
        }

        return true;
      },
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {dx: translateX}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        if (translateXValue.current < -(constants.screenWidth / 5)) {
          Animated.spring(translateX, {
            toValue: -(constants.screenWidth * 1.3),
            useNativeDriver: true,
          }).start();

          props.onNext().then(result => {
            if (!result) {
              console.log('false');
              Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: true,
              }).start();
            }
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  /*const scale = translateX.interpolate({
    inputRange: [0, constants.screenWidth / 5],
    outputRange: [1, 1.1],
  });

  const rotate = translateX.interpolate({
    inputRange: [0, constants.screenWidth / 5],
    outputRange: ['0deg', '-10deg'],
  });*/

  useEffect(() => {
    const id = translateX.addListener(result => {
      translateXValue.current = result.value;
    });
    return () => {
      translateX.removeListener(id);
    };
  }, []);

  const backgroundColor = useMemo(() => {
    return emotionBackgorundColor[props.emotion];
  }, [props.emotion]);

  if (!props.focused && !props.readyToFocus) {
    return null;
  }

  return (
    <Animated.View
      style={[
        props.style,
        {
          backgroundColor,
          transform: [
            {translateX},
            // {scale}, {rotate}
          ],
        },
      ]}
      {...panResponder.panHandlers}>
      <Figure emotion={props.emotion} />
      <Feanut emotion={props.emotion} />
      <View style={styles.body}>
        <View style={styles.titleArea}>
          <FastImage
            style={styles.icon}
            resizeMode={FastImage.resizeMode.contain}
            source={{uri: props.iconURI}}
          />
          <Text
            color={colors.white}
            mt={15}
            weight="bold"
            size={27}
            mx={30}
            align="center">
            {props.title}
          </Text>
        </View>
        <View>
          {props.focused || props.selectedFriend ? (
            props.friends.map((x, i) => {
              return (
                <PollFriendItem
                  gender={x.gender}
                  label={x.label}
                  key={x.value}
                  source={x.source}
                  selected={props.selectedFriend === x.value}
                  color={pointColor}
                  onPress={handleFriendSelect(x)}
                  mb={15}
                />
              );
            })
          ) : (
            <ActivityIndicator color={colors.white} />
          )}
        </View>

        {props.focused && (
          <View style={[styles.footer, {marginBottom: insets.bottom}]}>
            <TouchableOpacity
              onPress={props.onSkip}
              style={styles.footerButton}>
              <WithLocalSvg width={20} height={16} asset={svgs.shuffle} />
              <Text ml={7} color={colors.white} size={12}>
                투표 건너뛰기
              </Text>
            </TouchableOpacity>

            <View style={styles.footerDivider} />

            <TouchableOpacity
              onPress={props.onShuffle}
              style={styles.footerButton}>
              <WithLocalSvg width={14} height={16} asset={svgs.refresh} />
              <Text ml={7} color={colors.white} size={12}>
                친구 다시찾기
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {!props.focused && <View />}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 45,
    height: 45,
  },
  titleArea: {alignItems: 'center', marginTop: constants.screenWidth * 0.05},
  body: {
    zIndex: 3,
    paddingVertical: 30,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerDivider: {
    width: 1,
    height: 18,
    backgroundColor: colors.white,
    marginHorizontal: 30,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
