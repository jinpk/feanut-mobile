import React from 'react';
import {Image, ImageSourcePropType, StyleSheet, View} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {colors, svgs} from '../libs/common';

type AvatarProps = {
  source: ImageSourcePropType;
  size?: number;
  defaultLogo?: 'm' | 'w';
};

export function Avatar(props: AvatarProps): JSX.Element {
  return (
    <View
      style={[
        styles.root,
        {width: props.size || 55, height: props.size || 55},
        {borderRadius: (props.size || 55) / 2},
      ]}>
      {props.defaultLogo && !props.source && (
        <WithLocalSvg
          width={30}
          height={15}
          asset={
            props.defaultLogo === 'm' ? svgs.feanutBlue : svgs.feanutYellow
          }
        />
      )}
      {props.source && (
        <Image
          source={props.source}
          style={[styles.image, {borderRadius: (props.size || 55) / 2}]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGrey,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
