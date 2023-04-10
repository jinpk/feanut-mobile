import React, {memo} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Gender} from '../libs/interfaces';
import {Avatar} from './avatar';
import {BadgeButton} from './button';
import {Text} from './text';
import {getObjectURLByKey} from '../libs/common/file';

type FriendItemProps = {
  gender?: Gender;
  name: string;
  profileImageKey?: string;
  button?: string;
  buttonColor?: string;
  buttonLoading?: boolean;
  icon?: JSX.Element;

  onButtonPress?: () => void;
  onPress?: () => void;
};

export const FriendItem = memo((props: FriendItemProps) => {
  return (
    <View style={styles.root}>
      <TouchableOpacity onPress={props.onPress} disabled={!props.onPress}>
        {props.icon || (
          <Avatar
            size={42}
            uri={getObjectURLByKey(props.profileImageKey, '70')}
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

      <TouchableWithoutFeedback
        onPress={props.onPress}
        disabled={!props.onPress}>
        <View style={styles.body}>
          <Text>{props.name}</Text>
        </View>
      </TouchableWithoutFeedback>

      {Boolean(props.button) &&
        (props.buttonLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={props.buttonColor} />
          </View>
        ) : (
          <BadgeButton
            alignSelf="center"
            fontColor={props.buttonColor}
            title={props.button!}
            onPress={props.onButtonPress}
          />
        ))}
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
  loadingWrap: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
