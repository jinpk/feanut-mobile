import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WithLocalSvg} from 'react-native-svg';
import {Gif} from '../../components/image';
import {Text} from '../../components/text';
import {colors, gifs, svgs} from '../../libs/common';

type PollReachTemplateProps = {
  maxDailyCount: number;
};

function PollReachTemplate(props: PollReachTemplateProps): JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, {marginTop: insets.top}]}>
      <Gif source={gifs.highVoltage} />
      <Text weight="bold" mt={14} size={18}>
        오늘의 칭찬 투표를 다 하셨군요!
      </Text>

      <Text weight="medium" mt={30} align="center">
        투표는 하루에 {props.maxDailyCount}번만 참여할 수 있어요.{'\n'}
        내일{' '}
        <Text style={{backgroundColor: colors.yellow + '80'}} weight="bold">
          투표가 준비
        </Text>
        되면 알림으로 알려드릴게요!
      </Text>

      <View style={styles.voltages}>
        <WithLocalSvg
          width={30}
          height={15}
          asset={svgs.feanutVoltage}
          style={styles.voltage}
        />
        <WithLocalSvg
          width={30}
          height={15}
          asset={svgs.feanutVoltage}
          style={styles.voltage}
        />
        <WithLocalSvg
          width={30}
          height={15}
          asset={svgs.feanutVoltage}
          style={styles.voltage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voltages: {flexDirection: 'row', alignItems: 'center', marginTop: 60},
  voltage: {
    marginHorizontal: 5,
  },
});

export default PollReachTemplate;
