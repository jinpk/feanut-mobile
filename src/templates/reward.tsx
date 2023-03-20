import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Gif} from '../components/image';
import {Text} from '../components/text';
import {useInsets} from '../hooks';
import {gifs} from '../libs/images';

type RewardTemplateProps = {
  amount: number;
  totalAmount: number;
};

function RewardTemplate(props: RewardTemplateProps): JSX.Element {
  const insets = useInsets();
  return (
    <View style={[styles.root, {paddingBottom: insets.top}]}>
      <Gif source={gifs.partyPopper} />
      <Text weight="bold" mt={15} size={18}>
        와우! 피넛 {props.amount}개 적립
      </Text>
      <Text mt={30}>보유 피넛</Text>
      <Text mt={7} weight="bold" size={27}>
        {props.totalAmount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RewardTemplate;
