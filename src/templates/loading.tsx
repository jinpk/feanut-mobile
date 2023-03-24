import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Gif} from '../components/image';
import {Text} from '../components/text';
import {gifs} from '../libs/common';

type LoadingTemplateProps = {
  label?: string;
};

function LoadingTemplate(props: LoadingTemplateProps): JSX.Element {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.root,
        {
          // topbar height만큼 올려서 center 조절
          paddingBottom: insets.bottom + 50,
        },
      ]}>
      <Gif source={gifs.dolphin} />
      {Boolean(props.label) && (
        <Text mt={14} size={18} weight="bold" align="center">
          {props.label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoadingTemplate;
