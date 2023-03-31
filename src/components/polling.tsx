import React, {memo} from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WithLocalSvg} from 'react-native-svg';
import {colors, constants, emotions, svgs} from '../libs/common';
import {PollingFriendItem} from '../libs/interfaces/polling';
import {PollFriendItem} from './poll-friend-item';
import {Text} from './text';

type SVGProps = {
  asset: number;
  style: object;
  width: number;
};

type FigureProps = {
  emotion: emotions;
};

const Figure = memo((props: FigureProps) => {
  const svgProps: SVGProps = {
    asset: 0,
    style: {},
    width: constants.screenWidth * 0.7,
  };

  if (props.emotion === emotions.joy) {
    svgProps.asset = svgs.figureHappiness;
    svgProps.style = styles.figureRightBottom;
  } else if (props.emotion === emotions.gratitude) {
    svgProps.asset = svgs.figureGratitude;
    svgProps.style = styles.figureLeftBottom;
  } else if (props.emotion === emotions.serenity) {
    svgProps.asset = svgs.figureSerenity;
    svgProps.style = styles.figureRightBottom;
  } else if (props.emotion === emotions.interest) {
    svgProps.asset = svgs.figureInterest;
    svgProps.style = styles.figureLeftBottom;
  } else if (props.emotion === emotions.hope) {
    svgProps.asset = svgs.figureHope;
    svgProps.style = styles.figureRightBottom;
  } else if (props.emotion === emotions.pride) {
    svgProps.asset = svgs.figurePride;
    svgProps.style = styles.figureRightBottom;
    svgProps.width = constants.screenWidth * 0.8;
  } else if (props.emotion === emotions.amusement) {
    svgProps.asset = svgs.figureAmusement;
    svgProps.style = styles.figureLeftBottom;
  } else if (props.emotion === emotions.inspiration) {
    svgProps.asset = svgs.figureInspiration;
    svgProps.style = styles.figureRightBottom;
  } else if (props.emotion === emotions.awe) {
    svgProps.asset = svgs.figureAwe;
    svgProps.style = styles.figureLeftBottom;
  } else if (props.emotion === emotions.love) {
    svgProps.asset = svgs.figureLove;
    svgProps.style = styles.figureLeftBottom;
    svgProps.width = constants.screenWidth * 0.9;
  }

  return (
    <View style={svgProps.style}>
      <WithLocalSvg {...svgProps} height={constants.screenHeight * 0.7} />
    </View>
  );
});

type PollingProps = {
  backgroundColor: string;
  color: string;
  emotion: emotions;
  title: string;
  iconURI: string;
  friends: PollingFriendItem[];
  selectedFriend?: string;
  onShuffle: () => void;
  onSkip: () => void;
  onSelected: (value: string) => void;
  focused: boolean;
};

export const Polling = (props: PollingProps) => {
  const insets = useSafeAreaInsets();
  const handleFriendSelect =
    (friend: PollingFriendItem) => (e: GestureResponderEvent) => {
      props.onSelected(friend.value);
    };

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: props.backgroundColor || colors.primary,
        },
      ]}>
      <Figure emotion={props.emotion || emotions.interest} />
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
          color={props.color || colors.sky}
          asset={svgs.logoSimple}
        />
      </View>
      <View style={styles.body}>
        <View style={styles.titleArea}>
          <FastImage
            style={styles.icon}
            resizeMode={FastImage.resizeMode.contain}
            source={{uri: props.iconURI}}
          />
          <Text
            color={colors.white}
            mt={15}
            weight="bold"
            size={27}
            mx={30}
            align="center">
            {props.title}
          </Text>
        </View>
        <View>
          {(props.focused || props.selectedFriend) &&
            props.friends.map((x, i) => {
              return (
                <PollFriendItem
                  gender={x.gender}
                  label={x.label}
                  key={x.value}
                  source={x.source}
                  selected={props.selectedFriend === x.value}
                  color={props.color}
                  onPress={handleFriendSelect(x)}
                  mb={15}
                />
              );
            })}
        </View>

        <View style={[styles.footer]}>
          <TouchableOpacity onPress={props.onSkip} style={styles.footerButton}>
            <WithLocalSvg width={20} height={16} asset={svgs.shuffle} />
            <Text ml={7} color={colors.white} size={12}>
              투표 건너뛰기
            </Text>
          </TouchableOpacity>

          <View style={styles.footerDivider} />

          <TouchableOpacity
            onPress={props.onShuffle}
            style={styles.footerButton}>
            <WithLocalSvg width={14} height={14} asset={svgs.refresh} />
            <Text ml={7} color={colors.white} size={12}>
              친구 다시찾기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  icon: {
    width: 45,
    height: 45,
  },
  titleArea: {alignItems: 'center', marginTop: constants.screenWidth * 0.05},
  header: {
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    paddingVertical: 9,
  },
  body: {
    zIndex: 3,
    paddingVertical: 30,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  figureRightBottom: {
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
    right: 0,
  },
  figureLeftBottom: {
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
    left: 0,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerDivider: {
    width: 1,
    height: 18,
    backgroundColor: colors.white,
    marginHorizontal: 30,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
