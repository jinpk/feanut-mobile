import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {colors, emotions, gifs, svgs} from '../libs/common';
import {Gif} from './image';
import {Text} from './text';

type PollCardProps = {
  ml?: number;
  mx?: number;
  emotion: emotions;
};

export const PollCard = (props: PollCardProps): JSX.Element => {
  const asset = useMemo((): number | undefined => {
    switch (props.emotion) {
      case emotions.amusement:
        return svgs.pollCardAmusement;
      case emotions.hope:
        return svgs.pollCardHope;
      case emotions.love:
        return svgs.pollCardLove;
      case emotions.awe:
        return svgs.pollCardAwe;
      case emotions.gratitude:
        return svgs.pollCardGratitude;
      case emotions.joy:
        return svgs.pollCardHappiness;
      case emotions.inspiration:
        return svgs.pollCardInspiration;
      case emotions.serenity:
        return svgs.pollCardSerenity;
      case emotions.pride:
        return svgs.pollCardPride;
      case emotions.interest:
        return svgs.pollCardInterest;
    }
  }, [props.emotion]);
  return (
    <View
      style={{
        marginHorizontal: props.mx,
        marginLeft: props.ml,
      }}>
      <WithLocalSvg width={190} height={149} asset={asset} />
      <View style={styles.poll}>
        <Gif size={35} source={gifs.fire} />
        <Text color={colors.white} mt={18} size={18} weight="bold">
          첫인상이 가장{'\n'}좋았던 친구는?
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  poll: {
    top: 15,
    left: 15,
    position: 'absolute',
  },
});
