import {Image, StyleSheet} from 'react-native';
import {View} from 'react-native';
import {
  colors,
  emotionBackgorundColor,
  emotionKRLabel,
  emotionKRMessage,
  emotions,
  pngs,
  svgs,
} from '../../libs/common';
import {Text} from '../text';
import {formatLengthLabel} from '../../libs/common/utils';
import {WithLocalSvg} from 'react-native-svg';

type FeanutCardItemProps = {
  emotion: emotions;
  width: number;
  mr: number;
  mt?: number;
  ml?: number;
  value: number | string;
  horizontalLarge?: boolean;
  small?: boolean;

  name?: string;
};

export const FeanutCardItem = (props: FeanutCardItemProps) => {
  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: emotionBackgorundColor[props.emotion],
          width: props.width,
          height: props.width * (props.horizontalLarge ? 0.396 : 1.26),
          marginRight: props.mr,
          marginLeft: props.ml,
          marginTop: props.mt,
        },
      ]}>
      {props.horizontalLarge && (
        <Text mt={7} mb={9} color={colors.white}>
          <Text weight="bold" color={colors.white}>
            {props.name}님
          </Text>
          은
        </Text>
      )}
      <View
        style={[styles.content, props.horizontalLarge && styles.contentLarge]}>
        <Image
          source={pngs[`feanut-card-${props.emotion}`]}
          style={[styles.icon, props.horizontalLarge && styles.iconLarge]}
        />
        <View
          style={[
            styles.contentBody,
            props.horizontalLarge && styles.contentBodyLarge,
          ]}>
          <Text
            color={colors.white}
            size={props.horizontalLarge ? 21 : 15}
            lineHeight={props.horizontalLarge ? 25 : 18}
            weight="bold">
            {formatLengthLabel(props.value)}표{'\n'}
            <Text
              color={colors.white}
              size={props.horizontalLarge ? 18 : 13}
              weight="medium">
              {emotionKRLabel[props.emotion]}
            </Text>
          </Text>
        </View>
      </View>
      <Text
        mt={props.horizontalLarge ? 9 : props.small ? 4 : 5}
        color={colors.white}
        size={props.horizontalLarge ? 13 : props.small ? 11 : 12}
        lineHeight={15}>
        {props.horizontalLarge
          ? emotionKRMessage[props.emotion].replace(/\n/g, ' ')
          : emotionKRMessage[props.emotion]}
      </Text>
      <View style={styles.figure}>
        <WithLocalSvg asset={svgs[`feanut-card-${props.emotion}`]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    borderRadius: 15,
    backgroundColor: colors.black,
    padding: 14,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'column',
  },
  icon: {
    width: 28,
    height: 28,
  },
  iconLarge: {
    width: 50,
    height: 50,
  },
  contentBody: {
    marginTop: 4,
  },
  contentBodyLarge: {
    marginLeft: 8,
  },
  figure: {
    position: 'absolute',
    zIndex: -1,
    right: -1,
    bottom: 0,
  },
  contentLarge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
