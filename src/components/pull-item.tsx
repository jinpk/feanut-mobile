import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Source} from 'react-native-fast-image';
import {colors} from '../libs/common';
import {Gender} from '../libs/interfaces';
import {Avatar} from './avatar';
import {BadgeButton} from './button';
import {Text} from './text';

type PollingItemProps = {
  source?: Source;
  gender: Gender;
  name?: string;
  isOpened: boolean;
  time: string;
  onPress: () => void;
};

export const PullItem = memo(function (props: PollingItemProps): JSX.Element {
  return (
    <View style={styles.root}>
      <Avatar
        source={props.source}
        defaultLogo={props.gender === 'male' ? 'm' : 'w'}
      />
      <View style={styles.content}>
        <View style={styles.contentName}>
          <Text>
            {props.isOpened ? '친구가' : '누군가'} 나를 투표했어요!
          </Text>
          <Text color={colors.darkGrey} size={10}>
            {props.time}
          </Text>
        </View>
        <Text size={12} mt={1} color={colors.darkGrey}>
          {props.isOpened
            ? props.name
            : props.gender === 'male'
            ? '남자'
            : '여자'}
        </Text>
        <BadgeButton mt={14} title="자세히" onPress={props.onPress} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    paddingTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    height: 85,
  },
  content: {
    flex: 1,
    marginLeft: 30,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.mediumGrey,
  },
  contentName: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
