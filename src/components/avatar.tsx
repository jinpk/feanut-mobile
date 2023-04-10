import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, View} from 'react-native';
import FastImage, {Source} from 'react-native-fast-image';
import {colors, pngs} from '../libs/common';
import {FeanutImageGender} from '../libs/interfaces';

type AvatarProps = {
  source?: number | Source;
  size?: number;
  defaultLogo?: FeanutImageGender;
  uri?: string;
};

const MAX_REFRESH_COUNT = 10;

export function Avatar(props: AvatarProps): JSX.Element {
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setLoadError(false);
  }, [props.source, props.uri]);

  // 썸네일 조회시 바로 반영안되서 몇번 재시도
  const refreshCount = useRef(0);
  useEffect(() => {
    if (loadError) {
      if (refreshCount.current > MAX_REFRESH_COUNT) return;

      refreshCount.current++;

      let tm = setTimeout(() => {
        setLoadError(false);
      }, 3000);
      return () => {
        clearTimeout(tm);
      };
    }
  }, [loadError]);

  const renderImage = useCallback(() => {
    if (
      (loadError && refreshCount.current > MAX_REFRESH_COUNT) ||
      (!props.source && !props.uri)
    ) {
      const width = (props.size || 55) * 0.55;
      const height = width / 2;
      return (
        <Image
          style={{width, height}}
          resizeMode="contain"
          source={
            props.defaultLogo === 'm'
              ? pngs.feanutBlue
              : props.defaultLogo === 'w'
              ? pngs.feanutYellow
              : pngs.feanutDarkGrey
          }
        />
      );
    } else if (loadError) {
      // 이미지 요청 재시도 중일 경우
      return <ActivityIndicator />;
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
