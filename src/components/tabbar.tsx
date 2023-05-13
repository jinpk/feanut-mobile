import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from './text';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WithLocalSvg} from 'react-native-svg';
import {colors} from '../libs/common';

type TabBarProps = BottomTabBarProps;

export default function TabBar(props: TabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.tabs,
        {
          paddingBottom: insets.bottom,
        },
      ]}>
      {props.state.routes.map((route, index) => {
        const {options} = props.descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = props.state.index === index;

        const onPress = () => {
          const event = props.navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            props.navigation.navigate({name: route.name, merge: true});
          }
        };

        const onLongPress = () => {
          props.navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}>
            <WithLocalSvg
              asset={options.tabBarIcon}
              width={24}
              height={24}
              color={isFocused ? colors.dark : colors.tabIconOff}
            />
            <Text
              size={11}
              mt={3.25}
              color={isFocused ? colors.dark : colors.tabIconOff}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    borderTopWidth: 0.25,
    borderTopColor: colors.darkGrey,
    backgroundColor: colors.white,
  },
  tab: {
    flex: 1,
    paddingVertical: 9.75,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
