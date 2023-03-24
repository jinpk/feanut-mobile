import React, {PropsWithChildren} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from '../components/button';
import {Gif} from '../components/image';
import {Text} from '../components/text';

type FriendSyncTemplateProps = PropsWithChildren<{
  title: string;
  icon: number;
}>;

function FriendSyncTemplate(props: FriendSyncTemplateProps): JSX.Element {
  return (
    <View style={styles.root}>
      <View style={styles.body}>
        <Gif source={props.icon} />
        <Text mt={14} size={18} weight="bold" align="center">
          {props.title}
        </Text>
      </View>

      {props.children}

      <Button title="연락처 동기화" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: 50,
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
