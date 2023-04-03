import React, {PropsWithChildren} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage, {Source} from 'react-native-fast-image';
import {Text} from '../components/text';
import {colors} from '../libs/common';

type InformationProps = PropsWithChildren<{
  icon: Source | number;
  message: string;
  subMessage: string;
  markingText: string;
}>;

export const Information = (props: InformationProps) => {
  return (
    <View style={styles.root}>
      <FastImage
        source={props.icon}
        resizeMode={FastImage.resizeMode.contain}
        style={styles.icon}
      />
      <Text weight="bold" size={18} mt={15} align="center">
        {props.message}
      </Text>
      {Boolean(props.markingText) &&
        (() => {
          const markingStartIndex = props.subMessage.indexOf(props.markingText);
          const markingEndIndex = markingStartIndex + props.markingText.length;
          return (
            <Text mt={29} align="center">
              <Text>{props.subMessage.substring(0, markingStartIndex)}</Text>
              <Text
                style={{backgroundColor: colors.yellow + '80'}}
                weight="bold">
                {props.subMessage.substring(markingStartIndex, markingEndIndex)}
              </Text>
              <Text>
                {props.subMessage.substring(
                  markingEndIndex,
                  props.subMessage.length,
                )}
              </Text>
            </Text>
          );
        })()}
      {!props.markingText && (
        <Text size={14} mt={29} align="center">
          {props.subMessage}
        </Text>
      )}
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  icon: {
    width: 45,
    height: 45,
  },
});
