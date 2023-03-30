import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Timer} from '../components';
import {Button} from '../components/button';
import {Gif} from '../components/image';
import {Text} from '../components/text';
import {gifs} from '../libs/common';

type PollLockTemplateProps = {
  // unix
  remainTime?: number | undefined | null;
};

function PollLockTemplate(props: PollLockTemplateProps): JSX.Element {
  const insets = useSafeAreaInsets();

  const second = useMemo(() => {
    if (props.remainTime) {
      return Math.floor(props.remainTime / 60 / 60);
    } else {
      return 0;
    }
  }, [props.remainTime]);

  return (
    <View style={[styles.root, {marginTop: insets.top}]}>
      <Gif source={gifs.timerClock} />
      <Text weight="bold" mt={15} size={18} mb={30}>
        투표를 다 하셨군요!
      </Text>

      <Timer maxSecond={60 * 30} second={second} />

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
    paddingTop: 53,
  },
});

export default PollLockTemplate;
