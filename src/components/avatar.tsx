import React, {useCallback} from 'react';
import {Image, ImageSourcePropType, StyleSheet, View} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {colors, svgs} from '../libs/common';

type AvatarProps = {
  source?: ImageSourcePropType ;
  size?: number;
  defaultLogo?: 'm' | 'w';
};

export function Avatar(props: AvatarProps): JSX.Element {
  const renderImage = useCallback(() => {
    if (props.defaultLogo && !props.source) {
      const width = (props.size || 55) * 0.5;
      const height = width / 2;
      return (
        <WithLocalSvg
          width={width}
          height={height}
          asset={
            props.defaultLogo === 'm' ? svgs.feanutBlue : svgs.feanutYellow
          }
        />
      );
    } else if (props.source) {
      return (
        <Image
          source={props.source}
          style={[styles.image, {borderRadius: (props.size || 55) / 2}]}
        />
      );
    }
    return null;
  }, [props.defaultLogo, props.source, props.size]);

  return (
    <View
      style={[
        styles.root,
        {width: props.size || 55, height: props.size || 55},
        {borderRadius: (props.size || 55) / 2},
      ]}>
      {renderImage()}
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
