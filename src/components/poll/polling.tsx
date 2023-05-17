import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  NativeEventSubscription,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {WithLocalSvg} from 'react-native-svg';
import {
  colors,
  constants,
  emotionBackgorundColor,
  emotionPointColor,
  emotions,
  pngs,
  svgs,
} from '../../libs/common';
import {PollingFriendItem} from '../../libs/interfaces/polling';
import {PollFriendItem} from '../poll-friend-item';
import {Text} from '../text';
import {Feanut, Figure} from './layout';
import {Animated} from 'react-native';
import {AppState} from 'react-native';

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
  firstInited: boolean;
  onFirstInited: () => void;

  skipDisabled: boolean;
};

export const Polling = (props: PollingProps) => {
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

  /** 애니메이션중 백그라운드가면 */
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    let subscription: NativeEventSubscription;
    if (props.focused) {
      subscription = AppState.addEventListener('change', nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          // 돌아왔을떄 애니메이션 미처리 초기화
          if (translateXValue.current !== 0) {
            translateX.setValue(0);
          }
        }

        appState.current = nextAppState;
      });
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [props.focused]);

  /** 친구 선택후 반응 없으면 스크롤 가이드 */
  const didAnimatedGuide = useRef(false);
  useEffect(() => {
    let tm: number | undefined;
    if (props.selectedFriend && !didAnimatedGuide.current) {
      let tmMS = 2000;
      if (props.index >= 5) {
        tmMS = 5000;
      } else if (props.index >= 2) {
        tmMS = 3000;
      } else if (props.index === 0) {
        tmMS = 500;
      }

      tm = setTimeout(() => {
        Animated.sequence([
          Animated.timing(translateX, {
            useNativeDriver: true,
            toValue: -(constants.screenWidth / 5),
          }),
          Animated.delay(1000),
          Animated.timing(translateX, {
            useNativeDriver: true,
            toValue: 0,
          }),
        ]).start(r => {
          console.log(r.finished);
        });
        didAnimatedGuide.current = true;
      }, tmMS);
    }
    return () => {
      if (tm) {
        clearTimeout(tm);
        tm = undefined;
      }
    };
  }, [props.selectedFriend, props.index]);

  /**  첫 투표 슬라이드 애니메이션 */
  const [inited, setInited] = useState(props.initialIndex !== props.index);
  useEffect(() => {
    if (!inited) {
      Animated.timing(translateX, {
        useNativeDriver: true,
        duration: 500,
        toValue: 0,
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
      {props.emotion?.length > 0 && (
        <>
          <Figure emotion={props.emotion} />
          <Feanut emotion={props.emotion} />
        </>
      )}
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

        <View style={styles.friendsWrap}>
          <View
            key={props.friends?.map(x => x.value).join('-')}
            style={styles.friends}>
            {props.friends?.length >= 1 &&
              props.focused &&
              props.friends.map((x, i) => {
                return (
                  <PollFriendItem
                    label={x.label}
                    gender={x.gender}
                    key={x.value}
                    source={x.source}
                    selected={props.selectedFriend === x.value}
                    color={pointColor}
                    onPress={() => {
                      props.onSelected(x.value);
                    }}
                    ml={i === 1 || i == 3 ? 8 : 0}
                    mr={i === 0 || i == 2 ? 8 : 0}
                    mb={i < 2 ? 16 : 0}
                  />
                );
              })}
            {!props.friends?.length && props.focused && (
              <ActivityIndicator color={colors.white} />
            )}
          </View>
        </View>
      </View>

      <View style={styles.footerButtons}>
        <TouchableOpacity
          onPress={props.onShuffle}
          style={[styles.footerButton]}>
          <WithLocalSvg width={20} height={16} asset={svgs.shuffle} />
          <Text ml={10} color={colors.white} size={12}>
            친구 새로고침
          </Text>
        </TouchableOpacity>
        <View style={styles.buttonLine} />
        <TouchableOpacity
          disabled={props.skipDisabled}
          onPress={props.onSkip}
          style={[
            styles.footerButton,
            props.skipDisabled && {
              opacity: 0.5,
            },
          ]}>
          <Image style={styles.footerIcon} source={pngs.skip} />
          <Text ml={10} color={colors.white} size={12}>
            투표 건너뛰기
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
  friendsWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  friends: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  titleArea: {alignItems: 'center', marginTop: 60},
  body: {
    zIndex: 3,
    flex: 1,
    alignItems: 'center',
  },
  footerButton: {
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 30,
    justifyContent: 'center',
    paddingVertical: 4,
  },
  footerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    zIndex: 50,
    alignSelf: 'center',
  },
  buttonLine: {
    backgroundColor: colors.white,
    width: 1,
    height: 18,
  },
  footerIcon: {
    width: 10,
    height: 12,
    resizeMode: 'contain',
  },
});
