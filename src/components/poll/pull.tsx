import React, {useMemo} from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {colors, constants, emotionPointColor, svgs} from '../../libs/common';
import {configs} from '../../libs/common/configs';
import {PollingReceiveDetail} from '../../libs/interfaces/polling';
import {Avatar} from '../avatar';
import {PollFriendItem} from '../poll-friend-item';
import {Text} from '../text';
import {PollLayout} from './layout';

type PullProps = PollingReceiveDetail & {
  onShare: () => void;
  onOpen: () => void;
};

const ratio = constants.screenWidth / 393;

export const Pull = (props: PullProps) => {
  const pointColor = useMemo(() => {
    return emotionPointColor[props.pollId.emotion];
  }, [props.pollId]);

  return (
    <PollLayout emotion={props.pollId.emotion}>
      <View style={styles.body}>
        <View style={{alignItems: 'center'}}>
          <Avatar
            uri={
              props.voter.imageFileKey
                ? configs.cdnBaseUrl + '/' + props.voter.imageFileKey
                : ''
            }
            size={55 * ratio}
            defaultLogo={props.voter.gender === 'male' ? 'm' : 'w'}
          />
          {props.isOpened && (
            <Text color={colors.white} mt={15 * ratio}>
              <Text weight="bold" color={colors.white}>
                {props.voter.name}
              </Text>{' '}
              님이 나를 투표했어요!
            </Text>
          )}
          {!props.isOpened && (
            <Text color={colors.white} mt={15 * ratio}>
              친구가 나를 투표했어요!
            </Text>
          )}
        </View>

        <Text
          color={colors.white}
          weight="bold"
          size={27}
          mx={30}
          align="center">
          {props.pollId.contentText}
        </Text>

        <View>
          {props.friendIds.map((x, i) => {
            return (
              <PollFriendItem
                isPull
                gender={x.gender}
                label={x.name}
                key={x.profileId}
                source={
                  x.imageFileKey
                    ? {uri: configs.cdnBaseUrl + '/' + x.imageFileKey}
                    : undefined
                }
                selected={props.selectedProfileId === x.profileId}
                color={pointColor}
                mb={15}
              />
            );
          })}
        </View>

        <View style={[styles.footer]}>
          <TouchableWithoutFeedback onPress={props.onOpen}>
            <View style={[styles.share, styles.open]}>
              <WithLocalSvg
                width={12}
                height={15}
                asset={svgs.lock}
                style={styles.shareIcon}
              />
              <Text size={12}>
                {props.isOpened
                  ? `${props.voter.name}님 프로필 보기`
                  : '투표한 친구 확인하기'}
              </Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={props.onShare}>
            <View style={styles.share}>
              <WithLocalSvg
                width={12}
                height={15}
                asset={svgs.share}
                style={styles.shareIcon}
              />
              <Text size={12}>자랑하기</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </PollLayout>
  );
};

const styles = StyleSheet.create({
  titleArea: {alignItems: 'center', justifyContent: 'flex-end'},
  body: {
    zIndex: 3,
    flex: 1,
    justifyContent: 'space-evenly',
    paddingVertical: 16,
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
  share: {
    backgroundColor: colors.lightGrey,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 21,
    paddingVertical: 14,
    paddingLeft: 55,
    paddingHorizontal: 43,
    marginRight: 16,
  },
  shareIcon: {
    position: 'absolute',
    left: 21,
  },
  open: {
    flex: 1,
    marginLeft: 16,
    marginRight: 7,
    paddingLeft: 10,
    paddingRight: 0,
  },
});
