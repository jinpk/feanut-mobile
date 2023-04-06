import React, {RefObject, useCallback} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {Avatar} from '../components';
import {Text, TextMarker} from '../components/text';
import {BackTopBar} from '../components/top-bar';
import {colors, constants, svgs} from '../libs/common';
import {Gender} from '../libs/interfaces';
import ViewShot from 'react-native-view-shot';

type FeanutCardTemplateProps = {
  drawViewRef: RefObject<ViewShot>;

  onBack: () => void;
  onShare: () => void;

  name: string;
  statusMessage: string;
  gender?: Gender;
  uri: string;

  friendsCount: number;
  pollsCount: number;
  pullsCount: number;

  joy: number;
  gratitude: number;
  serenity: number;
  interest: number;
  hope: number;

  pride: number;
  amusement: number;
  inspiration: number;
  awe: number;
  love: number;

  instagram?: string;
  me: boolean;
};

const EMOTION_SIZE = (constants.screenWidth - 29 * 2 - 15 * 4) / 5;

const svgProps = {
  width: EMOTION_SIZE,
  height: EMOTION_SIZE,
};

function FeanutCardTemplate(props: FeanutCardTemplateProps) {
  const getLengthLabel = useCallback((length: string | number) => {
    if (!length) {
      return '0';
    }

    if (typeof length === 'string') {
      length = parseInt(length);
    }

    if (length >= 1000) {
      return `${(
        Math.floor(length / 1000) +
        (length % 1000) / 1000
      ).toPrecision(2)}k`;
    } else {
      return length;
    }
  }, []);
  return (
    <View style={styles.root}>
      <BackTopBar onBack={props.onBack} logo />
      <View style={styles.body}>
        <ViewShot
          ref={props.drawViewRef}
          style={styles.content}
          options={{format: 'jpg', quality: 0.7}}>
          <View style={styles.alignSelft}>
            <Avatar
              uri={props.uri}
              defaultLogo={
                props.gender === 'male'
                  ? 'm'
                  : props.gender === 'female'
                  ? 'w'
                  : undefined
              }
              size={constants.screenWidth * 0.35}
            />
          </View>

          <Text style={styles.alignSelft} weight="bold" mt={15}>
            {props.name}
          </Text>

          <Text style={styles.alignSelft} mt={7}>
            {props.statusMessage}
          </Text>

          <View style={styles.stats}>
            <View style={styles.statsContent}>
              <TextMarker color={'#0FC45E'} height={'60%'}>
                <Text style={styles.markedText}>
                  {getLengthLabel(props.friendsCount)}
                </Text>
              </TextMarker>
              <Text color={colors.darkGrey} size={12}>
                친구
              </Text>
            </View>
            <View style={styles.statsContent}>
              <TextMarker height={'60%'}>
                <Text style={styles.markedText}>
                  {getLengthLabel(props.pollsCount)}
                </Text>
              </TextMarker>
              <Text color={colors.darkGrey} size={12}>
                투표 참여
              </Text>
            </View>
            <View style={styles.statsContent}>
              <TextMarker color={'#4093CF'} height={'60%'}>
                <Text style={styles.markedText}>
                  {getLengthLabel(props.pullsCount)}
                </Text>
              </TextMarker>
              <Text color={colors.darkGrey} size={12}>
                투표 수신
              </Text>
            </View>
          </View>

          <View style={styles.emotions}>
            <View style={styles.emotion}>
              <View style={styles.emotionWrap}>
                <WithLocalSvg {...svgProps} asset={svgs.feanutCardHappiness} />
                <Text style={styles.length} size={12}>
                  {getLengthLabel(props.joy)}
                </Text>
              </View>
              <Text size={10} mt={7} color={colors.darkGrey}>
                기쁨
              </Text>
            </View>
            <View style={styles.emotion}>
              <View style={styles.emotionWrap}>
                <WithLocalSvg {...svgProps} asset={svgs.feanutCardGratitude} />
                <Text style={styles.length} size={12}>
                  {getLengthLabel(props.gratitude)}
                </Text>
              </View>
              <Text size={10} mt={7} color={colors.darkGrey}>
                감사
              </Text>
            </View>
            <View style={styles.emotion}>
              <View style={styles.emotionWrap}>
                <WithLocalSvg {...svgProps} asset={svgs.feanutCardSerenity} />
                <Text style={styles.length} size={12}>
                  {getLengthLabel(props.serenity)}
                </Text>
              </View>
              <Text size={10} mt={7} color={colors.darkGrey}>
                평온
              </Text>
            </View>
            <View style={styles.emotion}>
              <View style={styles.emotionWrap}>
                <WithLocalSvg {...svgProps} asset={svgs.feanutCardInterest} />
                <Text style={styles.length} size={12}>
                  {getLengthLabel(props.interest)}
                </Text>
              </View>
              <Text size={10} mt={7} color={colors.darkGrey}>
                흥미
              </Text>
            </View>
            <View style={styles.emotion}>
              <View style={styles.emotionWrap}>
                <WithLocalSvg {...svgProps} asset={svgs.feanutCardHope} />
                <Text style={styles.length} size={12}>
                  {getLengthLabel(props.hope)}
                </Text>
              </View>
              <Text size={10} mt={7} color={colors.darkGrey}>
                희망
              </Text>
            </View>
          </View>

          <View style={styles.emotions}>
            <View style={styles.emotion}>
              <View style={styles.emotionWrap}>
                <WithLocalSvg {...svgProps} asset={svgs.feanutCardPride} />
                <Text style={styles.length} size={12}>
                  {getLengthLabel(props.pride)}
                </Text>
              </View>
              <Text size={10} mt={7} color={colors.darkGrey}>
                자부심
              </Text>
            </View>
            <View style={styles.emotion}>
              <View style={styles.emotionWrap}>
                <WithLocalSvg {...svgProps} asset={svgs.feanutCardAmusement} />
                <Text style={styles.length} size={12}>
                  {getLengthLabel(props.amusement)}
                </Text>
              </View>
              <Text size={10} mt={7} color={colors.darkGrey}>
                즐거움
              </Text>
            </View>
            <View style={styles.emotion}>
              <View style={styles.emotionWrap}>
                <WithLocalSvg
                  {...svgProps}
                  asset={svgs.feanutCardInspiration}
                />
                <Text style={styles.length} size={12}>
                  {getLengthLabel(props.inspiration)}
                </Text>
              </View>
              <Text size={10} mt={7} color={colors.darkGrey}>
                영감
              </Text>
            </View>
            <View style={styles.emotion}>
              <View style={styles.emotionWrap}>
                <WithLocalSvg {...svgProps} asset={svgs.feanutCardAwe} />
                <Text style={styles.length} size={12}>
                  {getLengthLabel(props.awe)}
                </Text>
              </View>
              <Text size={10} mt={7} color={colors.darkGrey}>
                놀람
              </Text>
            </View>
            <View style={styles.emotion}>
              <View style={styles.emotionWrap}>
                <WithLocalSvg {...svgProps} asset={svgs.feanutCardLove} />
                <Text style={styles.length} size={12}>
                  {getLengthLabel(props.love)}
                </Text>
              </View>
              <Text size={10} mt={7} color={colors.darkGrey}>
                사랑
              </Text>
            </View>
          </View>
        </ViewShot>

        <TouchableOpacity onPress={props.onShare} style={styles.share}>
          <WithLocalSvg
            width={12}
            height={15}
            asset={props.me ? svgs.share : svgs.visitSNS}
            style={styles.shareIcon}
          />
          <Text size={12}>{props.me ? '자랑하기' : 'Instagram 방문'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    paddingVertical: 40,
    borderRadius: 20,
  },
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  body: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  stats: {
    flexDirection: 'row',
    marginBottom: constants.screenWidth * 0.11,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 15,
  },
  statsContent: {alignItems: 'center'},
  emotions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 29,
    justifyContent: 'space-between',
    marginTop: 15,
  },
  emotion: {
    alignItems: 'center',
  },
  emotionWrap: {
    width: EMOTION_SIZE,
    height: EMOTION_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  share: {
    backgroundColor: colors.lightGrey,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 21,
    paddingVertical: 14,
    alignSelf: 'center',
    paddingLeft: 55,
    paddingHorizontal: 43,
    marginTop: 30,
  },
  shareIcon: {
    position: 'absolute',
    left: 21,
  },
  length: {position: 'absolute'},
  markedText: {
    minWidth: 34,
    textAlign: 'center',
  },
  alignSelft: {alignSelf: 'center'},
});

export default FeanutCardTemplate;
