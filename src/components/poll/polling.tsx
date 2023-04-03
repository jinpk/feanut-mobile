import React, {useMemo} from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {WithLocalSvg} from 'react-native-svg';
import {
  colors,
  constants,
  emotionPointColor,
  emotions,
  svgs,
} from '../../libs/common';
import {PollingFriendItem} from '../../libs/interfaces/polling';
import {PollFriendItem} from '../poll-friend-item';
import {Text} from '../text';
import {PollLayout} from './layout';

type PollingProps = {
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
  const handleFriendSelect =
    (friend: PollingFriendItem) => (e: GestureResponderEvent) => {
      props.onSelected(friend.value);
    };

  const pointColor = useMemo(() => {
    return emotionPointColor[props.emotion];
  }, [props.emotion]);

  return (
    <PollLayout emotion={props.emotion}>
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
                  color={pointColor}
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
    </PollLayout>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 45,
    height: 45,
  },
  titleArea: {alignItems: 'center', marginTop: constants.screenWidth * 0.05},
  body: {
    zIndex: 3,
    paddingVertical: 30,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
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
