import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import {Text} from './text';
import {colors} from '../libs/common';

type TabsProps = {
  titles: string[];
  index: number;
  onIndexChange: (index: number) => void;
};

export default function Tabs(props: TabsProps) {
  return (
    <View style={styles.root}>
      {props.titles.map((x, i) => {
        const selected = i === props.index;
        return (
          <TouchableOpacity
            onPress={() => {
              props.onIndexChange(i);
            }}
            style={styles.tab}
            key={i.toString()}>
            <Text
              size={15}
              lineHeight={18}
              color={selected ? colors.black : colors.darkGrey}
              weight="medium">
              {x}
            </Text>
            {selected && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'stretch',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.mediumGrey,
  },
  tab: {
    flex: 1,
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    width: '100%',
    height: 1,
    backgroundColor: colors.primary,
    position: 'absolute',
    bottom: -0.5,
  },
});
