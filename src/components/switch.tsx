import React, {useEffect} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  useAnimatedValue,
  View,
} from 'react-native';
import {colors} from '../libs/common';

type SwitchProps = {
  value: boolean;
  onChange: (value: boolean) => void;
};

function Switch(props: SwitchProps): JSX.Element {
  const translateX = useAnimatedValue(0);

  useEffect(() => {
    Animated.timing(translateX, {
      easing: Easing.linear,
      useNativeDriver: false,
      toValue: props.value ? 13 : 0,
      duration: 300,
    }).start();
  }, [props.value]);

  return (
    <TouchableNativeFeedback
      onPress={() => {
        props.onChange(props.value ? false : true);
      }}>
      <View style={[styles.root, props.value && styles.rootOn]}>
        <Animated.View style={[styles.ball, {transform: [{translateX}]}]} />
      </View>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: 14,
    backgroundColor: colors.mediumGrey,
    padding: 2,
    width: 33,
    height: 20,
  },
  ball: {
    backgroundColor: colors.white,
    width: 16,
    height: 16,
    borderRadius: 16,
  },
  rootOn: {
    backgroundColor: colors.primary,
  },
});

export default Switch;
