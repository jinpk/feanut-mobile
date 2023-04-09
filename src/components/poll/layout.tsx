import React, {memo, PropsWithChildren, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WithLocalSvg} from 'react-native-svg';
import {
  constants,
  emotionBackgorundColor,
  emotionPointColor,
  emotions,
  svgs,
} from '../../libs/common';

type SVGProps = {
  asset: number;
  style: object;
  width: number;
  height: number;
};

type FigureProps = {
  emotion: emotions;
};

const ratio = constants.screenWidth / 393;
export const Figure = memo((props: FigureProps) => {
  const svgProps: SVGProps = {
    asset: 0,
    style: {},
    width: 0,
    height: constants.screenHeight * 0.42,
  };

  if (props.emotion === emotions.joy) {
    svgProps.asset = svgs.figureHappiness;
    svgProps.style = styles.figureRightBottom;
    svgProps.width = ratio * 303;
  } else if (props.emotion === emotions.gratitude) {
    svgProps.asset = svgs.figureGratitude;
    svgProps.style = styles.figureLeftBottom;
    svgProps.width = ratio * 327;
  } else if (props.emotion === emotions.serenity) {
    svgProps.asset = svgs.figureSerenity;
    svgProps.style = styles.figureRightBottom;
    svgProps.width = ratio * 318;
  } else if (props.emotion === emotions.interest) {
    svgProps.asset = svgs.figureInterest;
    svgProps.style = styles.figureLeftBottom;
    svgProps.width = ratio * 362;
  } else if (props.emotion === emotions.hope) {
    svgProps.asset = svgs.figureHope;
    svgProps.style = styles.figureRightBottom;
    svgProps.width = ratio * 373;
  } else if (props.emotion === emotions.pride) {
    svgProps.asset = svgs.figurePride;
    svgProps.style = styles.figureRightBottom;
    svgProps.width = ratio * 213;
  } else if (props.emotion === emotions.amusement) {
    svgProps.asset = svgs.figureAmusement;
    svgProps.style = styles.figureLeftBottom;
    svgProps.width = ratio * 343;
  } else if (props.emotion === emotions.inspiration) {
    svgProps.asset = svgs.figureInspiration;
    svgProps.style = styles.figureRightBottom;
    svgProps.width = ratio * 293;
  } else if (props.emotion === emotions.awe) {
    svgProps.asset = svgs.figureAwe;
    svgProps.style = styles.figureLeftBottom;
    svgProps.width = ratio * 357;
  } else if (props.emotion === emotions.love) {
    svgProps.asset = svgs.figureLove;
    svgProps.style = styles.figureLeftBottom;
    svgProps.width = ratio * 378;
  }

  return (
    <View style={svgProps.style}>
      <WithLocalSvg {...svgProps} height={constants.screenHeight * 0.7} />
    </View>
  );
});

type FeanutProps = {
  emotion: emotions;
};

export const Feanut = memo((props: FeanutProps) => {
  const insets = useSafeAreaInsets();
  const pointColor = useMemo(() => {
    return emotionPointColor[props.emotion];
  }, [props.emotion]);

  return (
    <View
      style={[
        styles.header,
        {
          marginTop: insets.top,
        },
      ]}>
      <WithLocalSvg
        width={67}
        height={35}
        color={pointColor}
        asset={svgs.logoSimple}
      />
    </View>
  );
});

type PollLayoutProps = PropsWithChildren<{
  emotion: emotions;
}>;

export const PollLayout = (props: PollLayoutProps) => {
  const backgroundColor = useMemo(() => {
    return emotionBackgorundColor[props.emotion];
  }, [props.emotion]);

  return (
    <View style={[styles.root, {backgroundColor}]}>
      <Figure emotion={props.emotion} />
      <View style={styles.container}>
        <Feanut emotion={props.emotion} />
        {props.children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    zIndex: 5,
    elevation: 5,
  },
  header: {
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    paddingVertical: 9,
  },
  figureRightBottom: {
    position: 'absolute',
    zIndex: 1,
    elevation: 1,
    bottom: 0,
    right: 0,
  },
  figureLeftBottom: {
    position: 'absolute',
    elevation: 1,
    zIndex: 1,
    bottom: 0,
    left: 0,
  },
});
