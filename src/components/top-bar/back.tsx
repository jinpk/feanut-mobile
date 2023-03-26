import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
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
      <TouchableOpacity onPress={props.onBack} style={[styles.leftItem]}>
        <WithLocalSvg width={7} height={14} asset={svgs.back} />
      </TouchableOpacity>
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
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  leftItem: {
    left: 0,
    position: 'absolute',
    paddingHorizontal: 15,
  },
  rightItem: {
    right: 0,
    position: 'absolute',
  },
});
