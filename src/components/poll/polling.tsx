import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
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
import {Feanut, Figure} from './layout';
import {Animated} from 'react-native';
import {MainTopBar} from '../top-bar/main';

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

  // 다음 순서
  readyToFocus: boolean;
  // 현재 순서
  focused: boolean;

  onNext: () => Promise<boolean>;

  index: number;
  initialIndex: number;
  latest?: boolean;
  firstInited: boolean;
  onFirstInited: () => void;
};

export const Polling = (props: PollingProps) => {
  const insets = useSafeAreaInsets();

  /** 애니메이션 */
  const translateX = useRef(
    new Animated.Value(
      props.initialIndex === props.index ? constants.screenWidth : 0,
    ),
  ).current;
  const translateXValue = useRef(0);
  useEffect(() => {
    const id = translateX.addListener(result => {
      translateXValue.current = result.value;
    });
    return () => {
      translateX.removeListener(id);
    };
  }, []);
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (e, gestureState) => {
        const {dx, dy} = gestureState;
        // x:3, y:10 이하 무조건 터치
        if (Math.abs(dx) < 3 && Math.abs(dy) < 10) {
          e.stopPropagation();
          return false;
        }

        return true;
      },
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        if (gestureState.dx < 50) {
          Animated.timing(translateX, {
            duration: 1,
            toValue: gestureState.dx,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.timing(translateX, {
            duration: 1,
            toValue: 50 + (gestureState.dx - 50) / 10,
            useNativeDriver: true,
          }).start();
        }
      },

      onPanResponderRelease: () => {
        if (translateXValue.current < -(constants.screenWidth / 5)) {
          Animated.spring(translateX, {
            toValue: -(constants.screenWidth * 1.3),
            useNativeDriver: true,
          }).start();

          props.onNext().then(result => {
            if (!result) {
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

  /**  첫 투표 슬라이드 애니메이션 */
  const [inited, setInited] = useState(props.initialIndex !== props.index);
  useEffect(() => {
    if (!inited) {
      Animated.spring(translateX, {
        velocity: 10,
        useNativeDriver: true,
        toValue: 0,
        bounciness: 1,
        speed: 5,
      }).start(r => {
        if (!r.finished) {
          translateX.setValue(0);
        }
        setInited(true);
      });
      let checked = false;
      let id = translateX.addListener(result => {
        if (result.value < 20 && !checked) {
          checked = true;
          props.onFirstInited();
        }
      });
      return () => {
        translateX.removeListener(id);
      };
    }
  }, [inited]);

  /**  첫 투표 슬라이드시 바로 다음 투표 대기 후처리 */
  useEffect(() => {
    if (props.readyToFocus) {
      if (props.firstInited) {
        translateX.setValue(0);
      } else {
        translateX.setValue(constants.screenWidth);
      }
    }
  }, [props.readyToFocus, props.firstInited]);

  /** Polling state */
  const isSelectedStore = useRef(false);
  useEffect(() => {
    isSelectedStore.current = props.selectedFriend ? true : false;
  }, [props.selectedFriend]);

  /** Emotion colors */
  const backgroundColor = useMemo(() => {
    return emotionBackgorundColor[props.emotion];
  }, [props.emotion]);
  const pointColor = useMemo(() => {
    return emotionPointColor[props.emotion];
  }, [props.emotion]);

  /** 현재순서 | 다음순서 아니면 return null */
  if (!props.focused && !props.readyToFocus) {
    return null;
  }

  return (
    <Animated.View
      style={[
        props.style,
        {
          backgroundColor,
          transform: [{translateX}],
        },
      ]}
      {...(inited && panResponder.panHandlers)}>
      {props.latest && (
        <MainTopBar
          hideLogo
          white
          onInboxPress={() => {}}
          onProfilePress={() => {}}
        />
      )}
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
        <View style={styles.friends}>
          {props.friends?.length >= 1 ? (
            props.friends.map((x, i) => {
              return (
                <PollFriendItem
                  gender={x.gender}
                  label={x.label}
                  key={i.toString()}
                  source={x.source}
                  selected={props.selectedFriend === x.value}
                  color={pointColor}
                  onPress={() => {
                    props.onSelected(x.value);
                  }}
                  mb={15}
                />
              );
            })
          ) : (
            <ActivityIndicator color={colors.white} />
          )}
        </View>
      </View>

      <View style={[styles.footer, {marginBottom: 30 + insets.bottom}]}>
        <TouchableOpacity onPress={props.onSkip} style={styles.footerButton}>
          <WithLocalSvg width={20} height={16} asset={svgs.shuffle} />
          <Text ml={7} color={colors.white} size={12}>
            투표 건너뛰기
          </Text>
        </TouchableOpacity>

        <View style={styles.footerDivider} />

        <TouchableOpacity onPress={props.onShuffle} style={styles.footerButton}>
          <WithLocalSvg width={14} height={16} asset={svgs.refresh} />
          <Text ml={7} color={colors.white} size={12}>
            친구 다시찾기
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 45,
    height: 45,
  },
  friends: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleArea: {alignItems: 'center', marginTop: 60},
  body: {
    zIndex: 3,
    flex: 1,
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    zIndex: 30,
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
