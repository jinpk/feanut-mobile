import React, {useEffect} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  useAnimatedValue,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors} from '../libs/common';

type PollIndicatorProps = {
  length: number;
  index: number;
};

const SCREEN_WIDTH = Dimensions.get('window').width;

export const LineIndicator = (props: PollIndicatorProps): JSX.Element => {
  const insets = useSafeAreaInsets();
  const indicatorWidth = useAnimatedValue(0);

  useEffect(() => {
    const barWidth =
      Math.ceil((SCREEN_WIDTH - 32) / props.length) * (props.index + 1);

    const toValue = !isFinite(barWidth) ? 0 : barWidth || 0;

    Animated.timing(indicatorWidth, {
      duration: 300,
      toValue,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start(r => {
      if (!r.finished) {
        indicatorWidth.setValue(toValue);
      }
    });
  }, [props.index, props.length]);

  return (
    <View style={[styles.indicator, {top: insets.top + 50 + 9}]}>
      <Animated.View style={[styles.indicatorBar, {width: indicatorWidth}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  indicator: {
    zIndex: 50,
    left: 16,
    right: 16,
    backgroundColor: colors.lightGrey + '59',
    borderRadius: 15,
    height: 3,
    position: 'absolute',
  },
  indicatorBar: {
    height: '100%',
    backgroundColor: colors.lightGrey + 'BF',
  },
});
