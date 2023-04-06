import React, {useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage, {Source} from 'react-native-fast-image';
import {WithLocalSvg} from 'react-native-svg';
import {colors, svgs} from '../libs/common';
import {FeanutImageGender} from '../libs/interfaces';

type AvatarProps = {
  source?: number | Source;
  size?: number;
  defaultLogo?: FeanutImageGender;
  uri?: string;
};

export function Avatar(props: AvatarProps): JSX.Element {
  const [loadError, setLoadError] = useState(false);

  const renderImage = useCallback(() => {
    if (loadError || (!props.source && !props.uri)) {
      const width = (props.size || 55) * 0.55;
      const height = width / 2;
      return (
        <WithLocalSvg
          width={width}
          height={height}
          {...(!props.defaultLogo && {
            color: colors.darkGrey,
          })}
          asset={
            !props.defaultLogo
              ? svgs.feanutDefault
              : props.defaultLogo === 'm'
              ? svgs.feanutBlue
              : svgs.feanutYellow
          }
        />
      );
    } else if (props.source || props.uri) {
      return (
        <FastImage
          source={props.uri ? {uri: props.uri} : props.source}
          resizeMode={FastImage.resizeMode.cover}
          style={[styles.image, {borderRadius: (props.size || 55) / 2}]}
          onError={() => {
            setLoadError(true);
          }}
        />
      );
    }
    return null;
  }, [props.defaultLogo, props.source, props.size, props.uri, loadError]);

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
