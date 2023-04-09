import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WithLocalSvg} from 'react-native-svg';
import {colors, svgs} from '../../libs/common';
import {Text} from '../text';

type MainTopBar = {
  onInboxPress: () => void;
  onProfilePress: () => void;

  white?: boolean;
  hideLogo?: boolean;

  zIndex?: number;
};

export const MainTopBar = (props: MainTopBar): JSX.Element => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, {top: insets.top, zIndex: props.zIndex || 50}]}>
      <TouchableOpacity onPress={props.onInboxPress} style={styles.optionItem}>
        <Text weight="medium" color={props.white ? colors.white : colors.dark}>
          수신함
        </Text>
      </TouchableOpacity>
      <View>
        {!props.hideLogo && (
          <WithLocalSvg width={67} height={35} asset={svgs.logoWithLetter} />
        )}
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
