import React, {PropsWithChildren} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage, {Source} from 'react-native-fast-image';
import {Text} from '../components/text';
import {colors} from '../libs/common';
import {WithLocalSvg} from 'react-native-svg';

type InformationProps = PropsWithChildren<{
  icon: Source | number;
  iconIsSvg?: boolean;
  message: string;
  subMessage: string;
  markingText: string;
}>;

export const Information = (props: InformationProps) => {
  return (
    <View style={styles.root}>
      {props.iconIsSvg && (
        <WithLocalSvg width={45} height={45} asset={props.icon as number} />
      )}
      {!props.iconIsSvg && (
        <FastImage
          source={props.icon}
          resizeMode={FastImage.resizeMode.contain}
          style={styles.icon}
        />
      )}

      <Text weight="bold" size={18} mt={15} align="center">
        {props.message}
      </Text>
      {Boolean(props.markingText) &&
        props.subMessage.split('\n').map((sentence, si) => {
          const markingStartIndex = sentence.indexOf(props.markingText);
          const markingEndIndex = markingStartIndex + props.markingText.length;

          return (
            <View
              style={[styles.wrap, {marginTop: si === 0 ? 29 : 0}]}
              key={si.toString()}>
              {markingStartIndex < 0 && <Text>{sentence}</Text>}

              {markingStartIndex >= 0 && (
                <View style={styles.textLines}>
                  <Text>{sentence.substring(0, markingStartIndex)}</Text>
                  <View style={{paddingHorizontal: 1}}>
                    <View style={styles.marker} />
                    <Text style={{zIndex: 2}} weight="bold">
                      {sentence.substring(markingStartIndex, markingEndIndex)}
                    </Text>
                  </View>
                  <Text>
                    {sentence.substring(markingEndIndex, sentence.length)}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
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
  wrap: {
    marginTop: 29,
    flexDirection: 'row',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  textLines: {
    flexDirection: 'row',
  },
  marker: {
    position: 'absolute',
    bottom: '10%',
    left: 0,
    right: 0,
    top: '20%',
    backgroundColor: colors.yellow + '80',
    transform: [{rotate: '-3deg'}],
    borderRadius: 12,
  },
});
