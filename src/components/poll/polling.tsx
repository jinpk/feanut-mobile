import React, {useMemo, useRef} from 'react';
import {
  GestureResponderEvent,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WithLocalSvg} from 'react-native-svg';
import {
  colors,
  constants,
  emotionPointColor,
  emotions,
  svgs,
} from '../../libs/common';
import {PollingFriendItem} from '../../libs/interfaces/polling';
import {PollFriendItem} from '../poll-friend-item';
import {Text} from '../text';
import {PollLayout} from './layout';

const GESTURE_X_WIDTH = 30;

type PollingProps = {
  emotion: emotions;
  title: string;
  iconURI: string;
  friends: PollingFriendItem[];
  selectedFriend?: string;
  onShuffle: () => void;
  onSkip: () => void;
  onSelected: (value: string) => void;
  focused: boolean;

  onNext: () => void;
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

  const gestureX = useRef(0);
  const slidePanResponder = useRef(
    PanResponder.create({
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureX.current < -GESTURE_X_WIDTH) {
          props.onNext();
        }
      },
      onPanResponderGrant: (_, __) => {
        gestureX.current = 0;
      },
      onPanResponderMove: (evt, gestureState) => {
        gestureX.current = gestureState.dx;
      },
      onPanResponderTerminate: (evt, gestureState) => {
        gestureX.current = 0;
      },
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return true;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        if (Math.abs(gestureState.dx) < GESTURE_X_WIDTH) {
          evt.stopPropagation();
          return false;
        }
        return true;
      },
      onPanResponderTerminationRequest: (_, __) => true,
      onShouldBlockNativeResponder: (_, __) => true,
    }),
  ).current;

  return (
    <PollLayout emotion={props.emotion}>
      <View {...slidePanResponder.panHandlers} style={styles.body}>
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
          {(props.focused || props.selectedFriend) &&
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
            })}
        </View>

        <View style={[styles.footer, {marginBottom: insets.bottom}]}>
          <TouchableOpacity onPress={props.onSkip} style={styles.footerButton}>
            <WithLocalSvg width={20} height={16} asset={svgs.shuffle} />
            <Text ml={7} color={colors.white} size={12}>
              투표 건너뛰기
            </Text>
          </TouchableOpacity>

          <View style={styles.footerDivider} />

          <TouchableOpacity
            onPress={props.onShuffle}
            style={styles.footerButton}>
            <WithLocalSvg width={14} height={14} asset={svgs.refresh} />
            <Text ml={7} color={colors.white} size={12}>
              친구 다시찾기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </PollLayout>
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
