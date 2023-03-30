import React, {PropsWithChildren} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from '../components/button';
import {Gif} from '../components/image';
import {Text} from '../components/text';

type FriendSyncTemplateProps = PropsWithChildren<{
  title: string;
  icon: number;
  message?: string;
  onSyncContacts: () => void;
}>;

function FriendSyncTemplate(props: FriendSyncTemplateProps): JSX.Element {
  return (
    <View style={styles.root}>
      <View style={styles.body}>
        <Gif source={props.icon} />
        <Text mt={14} size={18} weight="bold" align="center">
          {props.title}
        </Text>
        {Boolean(props.message) && (
          <Text mt={30} size={14} align="center">
            {props.message}
          </Text>
        )}
      </View>

      {props.children}

      <Button
        radius="m"
        alignSelf="center"
        px={68}
        onPress={props.onSyncContacts}
        title="연락처 동기화"
        mx={16}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: 57,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FriendSyncTemplate;
