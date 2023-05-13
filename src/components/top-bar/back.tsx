import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WithLocalSvg} from 'react-native-svg';
import {colors, svgs} from '../../libs/common';
import {Text} from '../text';

type BackTopBar = {
  onBack?: () => void;
  title?: string;
  logo?: boolean;
  rightComponent?: JSX.Element;

  absolute?: boolean;
};

export const BackTopBar = (props: BackTopBar): JSX.Element => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.root,
        {marginTop: insets.top},
        props.absolute && styles.rootAbsolute,
      ]}>
      {Boolean(props.onBack) && (
        <TouchableWithoutFeedback onPress={props.onBack}>
          <View style={[styles.leftItem]}>
            <WithLocalSvg
              width={14}
              height={14}
              asset={svgs.back}
              color={props.absolute ? colors.white : colors.darkGrey}
            />
          </View>
        </TouchableWithoutFeedback>
      )}

      <View style={styles.center}>
        {props.logo && (
          <WithLocalSvg width={67.5} height={35} asset={svgs.logoWithLetter} />
        )}
        {Boolean(props.title) && (
          <Text size={18} weight="bold">
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
  rootAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    right: 0,
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
  center: {position: 'absolute'},
});
