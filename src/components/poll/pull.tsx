import React, {useMemo} from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {
  colors,
  constants,
  emotionPointColor,
  gifs,
  svgs,
} from '../../libs/common';
import {PollingReceiveDetail} from '../../libs/interfaces/polling';
import {Avatar} from '../avatar';
import {Text} from '../text';
import {PollLayout} from './layout';
import {getObjectURLByKey} from '../../libs/common/file';
import {Gif} from '../image';
import {useGetEmojiURI} from '../../hooks';
import {Profile} from '../../libs/interfaces';

type PullProps = PollingReceiveDetail & {
  onShare: () => void;
  onOpen: () => void;

  myProfile: Profile;
};

const ratio = constants.screenWidth / 393;

export const Pull = (props: PullProps) => {
  const pointColor = useMemo(() => {
    return emotionPointColor[props.pollId.emotion];
  }, [props.pollId]);

  const emojiURI = useGetEmojiURI(props.pollId.emojiId);

  return (
    <PollLayout emotion={props.pollId.emotion}>
      <View style={styles.body}>
        <View style={{alignItems: 'center'}}>
          {Boolean(emojiURI) && <Gif source={{uri: emojiURI}} />}
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
              누군가{' '}
              <Text color={colors.white} weight="medium">
                나
              </Text>
              를 투표했어요!
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

        {/** <TouchableWithoutFeedback onPress={props.onOpen}>
            <View>
              <Avatar
                uri={getObjectURLByKey(props.voter.imageFileKey, '70')}
                size={55 * ratio}
                defaultLogo={props.voter.gender === 'male' ? 'm' : 'w'}
              />
            </View>
          </TouchableWithoutFeedback>

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
                    ? {uri: getObjectURLByKey(x.imageFileKey, '70')}
                    : undefined
                }
                selected={props.selectedProfileId === x.profileId}
                color={pointColor}
                mb={15}
              />
            );
          })}
        </View> */}

        <TouchableWithoutFeedback onPress={props.onOpen}>
          <View style={styles.voter}>
            <Avatar
              uri={getObjectURLByKey(props.voter.imageFileKey, '150')}
              size={100 * ratio}
              defaultLogo={props.voter.gender === 'male' ? 'm' : 'w'}
            />
            <Text color={colors.white} weight="medium" mt={10}>
              {props.isOpened
                ? props.voter.name
                : `친구(${props.voter.gender === 'male' ? '남자' : '여자'})`}
            </Text>
          </View>
        </TouchableWithoutFeedback>

        <Gif
          size={60 * ratio}
          source={gifs.pointingRight}
          style={styles.pointing}
        />

        <View style={styles.voter}>
          <Avatar
            uri={getObjectURLByKey(props.myProfile.profileImageKey, '150')}
            size={100 * ratio}
            defaultLogo={props.myProfile.gender === 'male' ? 'm' : 'w'}
          />
          <Text color={colors.white} weight="medium" mt={10}>
            {props.myProfile.name}
          </Text>
        </View>

        <View style={[styles.footer]}>
          <TouchableWithoutFeedback onPress={props.onOpen}>
            <View
              style={[
                styles.share,
                styles.open,
                {paddingLeft: props.isOpened ? 0 : 10},
              ]}>
              {!props.isOpened && (
                <WithLocalSvg
                  width={12}
                  height={15}
                  asset={svgs.lock}
                  style={styles.shareIcon}
                />
              )}

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
  voter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointing: {
    transform: [{rotate: '90deg'}],
  },
});
