import React, {useEffect} from 'react';
import {
  Animated,
  Image,
  Modal,
  StyleSheet,
  View,
  useAnimatedValue,
} from 'react-native';
import {Information} from '../../components';
import {constants, gifs, pngs, svgs} from '../../libs/common';
import {Button} from '../../components/button';

type GuideModalTemplateProps = {
  visible: boolean;
  onClose: () => void;
};

export const GuideModalTemplate = (
  props: GuideModalTemplateProps,
): JSX.Element => {
  const translate = useAnimatedValue(0);

  useEffect(() => {
    if (props.visible) {
      const to = (constants.screenWidth * 0.46) / 3;
      Animated.loop(
        Animated.sequence([
          Animated.timing(translate, {
            toValue: -to,
            useNativeDriver: true,
            duration: 1500,
          }),
          Animated.delay(1000),
        ]),
        {resetBeforeIteration: true},
      ).start();
    } else {
      translate.setValue(0);
    }
  }, [props.visible]);

  useEffect(() => {}, []);

  return (
    <Modal animationType="slide" visible={props.visible}>
      <Information
        icon={svgs.logo}
        iconIsSvg
        message="투표하고 싶은 친구를 선택 후 스와이프!"
        subMessage="친구를 선택 후 간단한 제스쳐로 투표를 완료할 수 있어요"
        markingText="간단한 제스쳐">
        <View style={styles.deviceLayer}>
          <Image source={pngs.guide1} style={styles.guide1} />
          <Animated.Image
            source={pngs.guide2}
            style={[styles.guide2, {transform: [{translateX: translate}]}]}
          />
          <Animated.Image
            source={gifs.backhand}
            style={[styles.backhand, {transform: [{translateX: translate}]}]}
          />
        </View>

        <Button
          mt={30}
          title="친구 추가하기"
          alignSelf="center"
          radius="m"
          px={83}
          onPress={props.onClose}
        />
      </Information>
    </Modal>
  );
};

const styles = StyleSheet.create({
  markerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cards: {
    marginVertical: 24,
  },
  deviceLayer: {
    marginTop: 30,
    width: constants.screenWidth * 0.46,
    height: constants.screenHeight * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceLayerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  guide1: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    position: 'absolute',
  },
  guide2: {
    width: '90%',
    height: '96%',
    resizeMode: 'contain',
    position: 'absolute',
  },
  backhand: {
    resizeMode: 'contain',
    position: 'absolute',
    width: 50,
    height: 50,
    right: 0,
    bottom: '20%',
  },
});
