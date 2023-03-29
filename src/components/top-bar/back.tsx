import React from 'react';
import {StyleSheet, TouchableNativeFeedback, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WithLocalSvg} from 'react-native-svg';
import {svgs} from '../../libs/common';
import {Text} from '../text';

type BackTopBar = {
  onBack?: () => void;
  title?: string;
  logo?: boolean;
  rightComponent?: JSX.Element;
};

export const BackTopBar = (props: BackTopBar): JSX.Element => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, {marginTop: insets.top}]}>
      <TouchableNativeFeedback onPress={props.onBack}>
        <View style={[styles.leftItem]}>
          <WithLocalSvg width={7} height={14} asset={svgs.back} />
        </View>
      </TouchableNativeFeedback>
      <View>
        {props.logo && (
          <WithLocalSvg width={67.5} height={35} asset={svgs.logoWithLetter} />
        )}
        {Boolean(props.title) && (
          <Text size={16} weight="medium">
            {props.title}
          </Text>
        )}
      </View>
      <View style={styles.rightItem}>
        {props.rightComponent && props.rightComponent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    height: 53,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  leftItem: {
    left: 0,
    position: 'absolute',
    paddingLeft: 15,
    paddingRight: 20,
    paddingVertical: 10,
  },
  rightItem: {
    right: 0,
    position: 'absolute',
  },
});
