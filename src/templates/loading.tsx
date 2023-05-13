import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Gif} from '../components/image';
import {Text} from '../components/text';
import {gifs} from '../libs/common';

type LoadingTemplateProps = {
  label?: string;
};

function LoadingTemplate(props: LoadingTemplateProps): JSX.Element {
  return (
    <View style={[styles.root]}>
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
