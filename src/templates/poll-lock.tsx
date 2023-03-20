import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Timer} from '../components';
import {Button} from '../components/button';
import {Gif} from '../components/image';
import {Text} from '../components/text';
import {useInsets} from '../hooks';
import {gifs} from '../libs/images';

type PollLockTemplateProps = {
  second: number;
};

function PollLockTemplate(props: PollLockTemplateProps): JSX.Element {
  const insets = useInsets();
  return (
    <View style={[styles.root, {paddingBottom: insets.top}]}>
      <Gif source={gifs.timerClock} />
      <Text weight="bold" mt={15} size={18} mb={30}>
        투표를 다 하셨군요!
      </Text>

      <Timer maxSecond={60 * 30} second={props.second} />

      <Text weight="medium" mt={30} align="center">
        곧 새로운 투표가 진행됩니다.{'\n'}
        잠시만 기다려주세요!
      </Text>

      <Button
        px={55}
        mt={30}
        disabled
        alignSelf="center"
        radius="m"
        title="투표하기"
      />
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

export default PollLockTemplate;
