import {Modal, StyleSheet, View} from 'react-native';
import {
  colors,
  constants,
  emotionBackgorundColor,
  emotionPointColor,
  emotions,
  svgs,
} from '../../libs/common';
import {WithLocalSvg} from 'react-native-svg';
import {useCallback, useLayoutEffect, useMemo, useRef} from 'react';
import {Text} from '../../components/text';
import dayjs from 'dayjs';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import FastImage from 'react-native-fast-image';
dayjs.extend(utc);
dayjs.extend(timezone);

type DrawedShareTemplateProps = {
  emotion: emotions;
  title: string;
  name: string;
  completedAt: string;
  icon: string;
  profileImage?: string;

  onClose: () => void;
};

const originViewWidth = 1080;
const originViewHeight = 1350;

function DrawedShareTemplate(props: DrawedShareTemplateProps) {
  const viewShotRef = useRef<ViewShot>(null);
  let width = constants.screenWidth;
  const ratio = constants.screenWidth / originViewWidth;
  let height = ratio * originViewHeight;

  const pointColor = useMemo(() => {
    return emotionPointColor[props.emotion];
  }, [props.emotion]);

  useLayoutEffect(() => {
    let tm = setTimeout(() => {
      if (viewShotRef.current?.capture) {
        viewShotRef.current.capture().then(uri => {
          const title = `누군가 나를 투표했어요!`;
          Share.open({
            title: title,
            filename: title,
            type: 'image/*',
            url: uri,
          })
            .catch(() => {
              return;
            })
            .finally(() => {
              props.onClose();
            });
        });
      }
    }, 1000);
    return () => {
      clearTimeout(tm);
    };
  }, []);

  const renderFigure = useCallback(() => {
    let asset: number;
    let width = 525;
    let height = 675;
    switch (props.emotion) {
      case emotions.joy:
        asset = svgs.pullHappiness;
        break;
      case emotions.gratitude:
        asset = svgs.pullGratitude;
        break;
      case emotions.serenity:
        asset = svgs.pullSerenity;
        width = 630;
        height = 780;
        break;
      case emotions.pride:
        asset = svgs.pullPride;
        height = 850;
        width = 350;
        break;
      case emotions.inspiration:
        asset = svgs.pullInspiration;
        break;
      case emotions.awe:
        asset = svgs.pullAwe;
        break;
      case emotions.interest:
        asset = svgs.pullInterest;
        height = 770;
        width = 620;
        break;
      case emotions.love:
        asset = svgs.pullLove;
        break;
      case emotions.amusement:
        asset = svgs.pullAmusement;
        break;
      case emotions.hope:
        asset = svgs.pullHope;
        break;
      default:
        return null;
    }

    return (
      <WithLocalSvg
        style={styles.figure}
        asset={asset}
        width={width * ratio}
        height={height * ratio}
      />
    );
  }, [props.emotion]);

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.root} collapsable={false}>
        <ViewShot ref={viewShotRef}>
          <View
            style={{
              width,
              height,
              padding: 75 * ratio,
              backgroundColor: emotionBackgorundColor[props.emotion],
              overflow: 'hidden',
            }}>
            {renderFigure()}
            <Text weight="medium" color={colors.white} size={25 * ratio}>
              {dayjs(props.completedAt).format('YYYY. MM. DD')}
            </Text>

            <View
              style={{
                marginTop: 120 * ratio,
                width: 100 * ratio,
                height: 100 * ratio,
              }}>
              <FastImage
                source={{uri: props.icon}}
                style={styles.icon}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
            <Text
              weight="medium"
              color={colors.white}
              mt={45 * ratio}
              size={35 * ratio}>
              누군가 나를 투표했어요!
            </Text>

            <Text
              weight="bold"
              color={colors.white}
              mt={60 * ratio}
              mb={90 * ratio}
              size={75 * ratio}>
              {props.title}
            </Text>

            <View style={[{width: 268 * ratio}, styles.profile]}>
              <View
                style={[
                  {
                    backgroundColor: pointColor,
                    width: 248 * ratio,
                    height: 310 * ratio,
                    borderRadius: 5 * ratio,
                  },
                ]}
              />
              <View
                style={[
                  styles.profileBackground,
                  {
                    top: 20 * ratio,
                    width: 248 * ratio,
                    height: 310 * ratio,
                    borderRadius: 5 * ratio,
                  },
                ]}>
                <View
                  style={[
                    styles.profileImage,
                    {borderRadius: 3 * ratio, marginTop: 21 * ratio},
                  ]}>
                  {Boolean(props.profileImage) && (
                    <FastImage
                      source={{uri: props.profileImage}}
                      resizeMode={FastImage.resizeMode.cover}
                      style={styles.profileImage2}
                    />
                  )}

                  {!Boolean(props.profileImage) && (
                    <WithLocalSvg
                      width={100 * ratio}
                      height={50 * ratio}
                      color={pointColor}
                      asset={svgs.feanutDefault}
                    />
                  )}
                </View>
              </View>
            </View>

            <Text
              mb={96 * ratio}
              color={colors.white}
              weight="medium"
              mt={35 * ratio}>
              {props.name}
            </Text>

            <View style={styles.logoWrap}>
              <View
                style={[
                  styles.iconWrap,
                  {
                    marginRight: 22 * ratio,
                    width: 55 * ratio,
                    height: 55 * ratio,
                  },
                ]}>
                <WithLocalSvg
                  asset={svgs.logo}
                  width={45 * ratio}
                  height={23 * ratio}
                />
              </View>
              <WithLocalSvg
                asset={svgs.logoLetter}
                width={84 * ratio}
                height={21 * ratio}
              />
            </View>
          </View>
        </ViewShot>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  figure: {
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  iconWrap: {
    backgroundColor: colors.white,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profile: {
    alignItems: 'flex-end',
  },
  profileBackground: {
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: colors.white,
    zIndex: 2,
    left: 0,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  profileImage: {
    backgroundColor: colors.lightGrey,
    width: '83%',
    height: '67%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage2: {
    width: '100%',
    height: '100%',
  },
});

export default DrawedShareTemplate;
