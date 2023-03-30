import dayjs from 'dayjs';
import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WithLocalSvg} from 'react-native-svg';
import {Gif} from '../../components/image';
import {Text} from '../../components/text';
import {colors, gifs, svgs} from '../../libs/common';

type PollLockTemplateProps = {
  todayCount: number;
  maxDailyCount: number;
  remainTime: number;
  onTimeout: () => void;
};

function PollLockTemplate(props: PollLockTemplateProps): JSX.Element {
  const insets = useSafeAreaInsets();
  const [second, setSecond] = useState(0);

  useEffect(() => {
    const startSecond = props.remainTime / 1000;
    setSecond(startSecond);

    let currentSecond = startSecond;
    let tm: number | null = setInterval(() => {
      currentSecond--;
      if (currentSecond >= 0) {
        setSecond(currentSecond);
      } else {
        props.onTimeout();
        clearInterval(tm as number);
        tm = null;
      }
    }, 1000);

    return () => {
      if (tm) {
        clearInterval(tm);
      }
    };
  }, [props.remainTime]);

  const title = useMemo(() => {
    switch (props.todayCount) {
      case 1:
        return '오늘의 첫 칭찬 투표를 완료 하셨군요!';
      default:
        return `오늘 ${props.todayCount}번이나 친구들을 칭찬했어요!`;
    }
  }, [props.todayCount]);

  return (
    <View style={[styles.root, {marginTop: insets.top}]}>
      <Gif source={gifs.hourglassNotDone} />
      <Text weight="bold" mt={14} size={18}>
        {title}
      </Text>
      {props.todayCount === 1 && (
        <Text weight="medium" mt={30} align="center">
          투표는 하루에 {props.maxDailyCount}번만 참여할 수 있어요.{'\n'}
          다음{' '}
          <Text style={{backgroundColor: colors.yellow + '80'}} weight="bold">
            투표가 준비
          </Text>
          되면 알림으로 알려드릴게요!
        </Text>
      )}
      {props.todayCount === 2 && (
        <Text weight="medium" mt={30} align="center">
          <Text style={{backgroundColor: colors.yellow + '80'}} weight="bold">
            마지막 투표
          </Text>
          도 곧 참여할 수 있어요.
        </Text>
      )}

      <Text mt={30} align="center">
        다음 투표까지
      </Text>

      <Text size={27} weight="bold" mt={7}>
        {dayjs()
          .set('minutes', Math.floor(second / 60))
          .set('seconds', second % 60)
          .format('mm:ss')}
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
          asset={props.todayCount === 2 ? svgs.feanutVoltage : svgs.feanutLight}
          style={styles.voltage}
        />
        <WithLocalSvg
          width={30}
          height={15}
          asset={svgs.feanutLight}
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

export default PollLockTemplate;
