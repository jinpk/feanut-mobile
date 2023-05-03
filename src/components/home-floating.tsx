import React, {memo, useEffect, useRef, useState} from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useAnimatedValue,
} from 'react-native';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, pngs} from '../libs/common';
import {Animated} from 'react-native';
import {Text} from './text';

type HomeFloatingProps = {
  onAddFriend: () => void;
  onInvite: () => void;
};

const addFriendToY = -42 - 56 - 16 - 16 + 7;
const inviteToY = -56 - 16 + 7;

const toWidth = 100;
const prevWidth = 42;

function HomeFloating(props: HomeFloatingProps) {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  const spin = useAnimatedValue(0);
  const scale = useAnimatedValue(1);

  const [textShow, setTextShow] = useState(false);

  const animating = useRef(false);

  useEffect(() => {
    animating.current = true;
    if (open) {
      Animated.timing(spin, {
        duration: 300,
        useNativeDriver: true,
        toValue: 1,
      }).start(() => {
        Animated.timing(itemButtonWidth, {
          useNativeDriver: false,
          toValue: toWidth,
          duration: 300,
        }).start(() => {
          setTextShow(true);
          animating.current = false;
        });
      });
    } else {
      Animated.timing(spin, {
        duration: 300,
        useNativeDriver: true,
        toValue: 0,
      }).start(() => {
        animating.current = false;
      });
      setTextShow(false);
      Animated.timing(itemButtonWidth, {
        useNativeDriver: false,
        toValue: prevWidth,
        duration: 300,
      }).start(() => {
        animating.current = false;
      });
    }
  }, [open]);

  const addFriendY = spin.interpolate({
    inputRange: [0, 1],
    outputRange: [0, addFriendToY],
  });

  const inviteY = spin.interpolate({
    inputRange: [0, 1],
    outputRange: [0, inviteToY],
  });

  const itemButtonWidth = useAnimatedValue(prevWidth);

  return (
    <View style={[styles.root, {bottom: insets.bottom + 16}]}>
      <TouchableWithoutFeedback
        onPressIn={() => {
          Animated.timing(scale, {
            useNativeDriver: true,
            duration: 300,
            toValue: 1.05,
          }).start();
        }}
        onPressOut={() => {
          Animated.timing(scale, {useNativeDriver: true, toValue: 1}).start();
        }}
        onPress={() => {
          if (animating.current) return;
          setOpen(prev => !prev);
        }}>
        <Animated.View style={[styles.action, {transform: [{scale}]}]}>
          <Animated.Image
            source={pngs.add}
            style={[
              styles.add,
              {
                transform: [
                  {
                    rotate: spin.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '45deg'],
                    }),
                  },
                ],
              },
            ]}
          />
        </Animated.View>
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.itemButton,
          {
            transform: [
              {
                translateY: addFriendY,
              },
            ],
          },
        ]}>
        <TouchableOpacity onPress={props.onAddFriend}>
          <Animated.View
            style={[styles.itemButtonContent, {minWidth: itemButtonWidth}]}>
            <Image style={styles.itemButtonIcon} source={pngs.addFriend} />
            {textShow && (
              <Text size={12} color={colors.primary}>
                친구추가
              </Text>
            )}
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
        style={[
          styles.itemButton,
          {
            transform: [
              {
                translateY: inviteY,
              },
            ],
          },
        ]}>
        <TouchableOpacity onPress={props.onInvite}>
          <Animated.View
            style={[styles.itemButtonContent, {minWidth: itemButtonWidth}]}>
            <Image style={styles.itemButtonIcon} source={pngs.invite} />
            {textShow && (
              <Text size={12} color={colors.primary}>
                친구초대
              </Text>
            )}
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
/** */

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    right: 16,
    bottom: 0,
  },
  action: {
    width: 56,
    height: 56,
    zIndex: 2,
    backgroundColor: colors.primary,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ddd',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  add: {
    width: 24,
    height: 24,
  },
  itemButton: {
    height: 42,
    minWidth: 42,
    borderRadius: 100,
    backgroundColor: '#FCF5EA',
    position: 'absolute',
    alignItems: 'stretch',
    justifyContent: 'center',
    right: 14 / 2,
    bottom: 14 / 2,

    shadowColor: '#ddd',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  itemButtonIcon: {
    width: 24,
    height: 24,
    marginRight: 9,
  },
  itemButtonContent: {
    flexDirection: 'row',
    paddingLeft: 9,
    height: '100%',
    alignItems: 'center',
  },
});

export default memo(HomeFloating);
