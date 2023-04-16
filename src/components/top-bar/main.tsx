import React, {useEffect} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useAnimatedValue,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WithLocalSvg} from 'react-native-svg';
import {colors, svgs} from '../../libs/common';
import {Text} from '../text';
import {Animated} from 'react-native';

type MainTopBar = {
  onInboxPress: () => void;
  onProfilePress: () => void;

  white?: boolean;
  hideLogo?: boolean;
  zIndex?: number;
};

export const MainTopBar = (props: MainTopBar): JSX.Element => {
  const insets = useSafeAreaInsets();
  const opacity = useAnimatedValue(1);

  useEffect(() => {
    if (props.hideLogo) {
      Animated.timing(opacity, {
        useNativeDriver: false,
        toValue: 0,
        duration: 1000,
      }).start(r => {
        if (!r.finished) {
          opacity.setValue(0);
        }
      });
    } else {
      Animated.timing(opacity, {
        useNativeDriver: false,
        toValue: 1,
        duration: 1000,
      }).start(r => {
        if (!r.finished) {
          opacity.setValue(1);
        }
      });
    }
  }, [props.hideLogo]);

  return (
    <View style={[styles.root, {top: insets.top, zIndex: props.zIndex || 50}]}>
      <TouchableOpacity onPress={props.onInboxPress} style={styles.optionItem}>
        <Text weight="medium" color={props.white ? colors.white : colors.dark}>
          수신함
        </Text>
      </TouchableOpacity>
      <View>
        <Animated.View style={{opacity}}>
          <WithLocalSvg width={67} height={35} asset={svgs.logoWithLetter} />
        </Animated.View>
      </View>
      <TouchableOpacity
        onPress={props.onProfilePress}
        style={styles.optionItem}>
        <Text weight="medium" color={props.white ? colors.white : colors.dark}>
          프로필
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 50,
    paddingVertical: 7,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 53,
  },
  optionItem: {
    paddingHorizontal: 15,
  },
});
