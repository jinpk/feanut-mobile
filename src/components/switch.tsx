import React, {useEffect} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableWithoutFeedback,
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
      toValue: props.value ? 15 : 0,
      duration: 300,
    }).start();
  }, [props.value]);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        props.onChange(props.value ? false : true);
      }}>
      <View style={[styles.root, props.value && styles.rootOn]}>
        <Animated.View style={[styles.ball, {transform: [{translateX}]}]} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: 14,
    backgroundColor: colors.mediumGrey,
    padding: 2,
    width: 39,
    height: 24,
  },
  ball: {
    backgroundColor: colors.white,
    width: 20,
    height: 20,
    borderRadius: 50,
  },
  rootOn: {
    backgroundColor: colors.primary,
  },
});

export default Switch;
