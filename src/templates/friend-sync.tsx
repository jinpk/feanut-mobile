import React, {PropsWithChildren} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from '../components/button';
import {Gif} from '../components/image';
import {Text} from '../components/text';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type FriendSyncTemplateProps = PropsWithChildren<{
  title: string;
  icon: number;
  message?: string;
  onSyncContacts: () => void;
}>;

function FriendSyncTemplate(props: FriendSyncTemplateProps): JSX.Element {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <View
        style={[
          styles.body,
          {
            paddingTop:
              insets.top +
              // topbar height
              57,
          },
        ]}>
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
        title="친구 추가하기"
        mx={16}
        mb={100 + insets.bottom}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  body: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

export default FriendSyncTemplate;
