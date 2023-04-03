import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {colors} from '../libs/common';
import {configs} from '../libs/common/configs';
import {Gender} from '../libs/interfaces';
import {Avatar} from './avatar';
import {BadgeButton} from './button';
import {Text} from './text';

type FriendItemProps = {
  gender?: Gender;
  username?: string;
  name: string;
  profileImageKey?: string;
  button?: string;
  buttonColor?: string;
  icon?: JSX.Element;

  onButtonPress?: () => void;
  onPress?: () => void;
};

export const FriendItem = memo((props: FriendItemProps) => {
  return (
    <View style={styles.root}>
      <TouchableOpacity onPress={props.onPress} disabled={!props.username}>
        {props.icon || (
          <Avatar
            size={42}
            uri={
              props.profileImageKey &&
              configs.cdnBaseUrl + '/' + props.profileImageKey
            }
            defaultLogo={
              props.gender === 'male'
                ? 'm'
                : props.gender === 'female'
                ? 'w'
                : undefined
            }
          />
        )}
      </TouchableOpacity>
      <View style={styles.body}>
        <TouchableOpacity onPress={props.onPress} disabled={!props.username}>
          <Text>{props.name}</Text>
          {Boolean(props.username) && (
            <Text color={colors.darkGrey} mt={1} size={12}>
              {props.username}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {Boolean(props.button) && (
        <BadgeButton
          alignSelf="center"
          fontColor={props.buttonColor}
          title={props.button!}
          onPress={props.onButtonPress}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: 7.5,
    paddingHorizontal: 16,
    height: 57,
  },
  body: {
    flex: 1,
    marginHorizontal: 15,
    alignItems: 'flex-start',
  },
});
