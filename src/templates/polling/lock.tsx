import dayjs from 'dayjs';
import React, {Fragment, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WithLocalSvg} from 'react-native-svg';
import {Text} from '../../components/text';
import {gifs, svgs} from '../../libs/common';
import {Information} from '../../components';
import {Gif} from '../../components/image';

type PollLockTemplateProps = {
  todayCount: number;
  maxDailyCount: number;
  remainTime?: number;
  onTimeout: () => void;
  isReached: boolean;
};

function PollLockTemplate(props: PollLockTemplateProps): JSX.Element {
  const insets = useSafeAreaInsets();
  const [second, setSecond] = useState(0);

  // 컴포넌트 매번 초기화되서 ref에 now 저장
  const now = useRef(dayjs());
  const triggeredTimeout = useRef(false);
  useEffect(() => {
    if (!props.remainTime || props.isReached || triggeredTimeout.current)
      return;

    // 투표 재참여 가능 시간
    const expiredAt = now.current.add(props.remainTime, 'milliseconds');
    let remainSecond = expiredAt.diff(dayjs(), 'seconds');
    if (remainSecond > 0 && !second) {
      setSecond(remainSecond);
    }

    let tm = setTimeout(() => {
      let remainSecond = expiredAt.diff(dayjs(), 'seconds');
      if (remainSecond <= 0) {
        triggeredTimeout.current = true;
        props.onTimeout();
        setSecond(0);
        return;
      }
      setSecond(remainSecond);
    }, 1000);

    return () => {
      clearTimeout(tm);
    };
  }, [props.remainTime, props.isReached, second]);

  const renderChildren = () => {
    return (
      <Fragment>
        <View style={[styles.voltages, {marginTop: props.isReached ? 60 : 33}]}>
          <WithLocalSvg
            width={30}
            height={15}
            asset={svgs.feanutVoltage}
            style={styles.voltage}
          />
          <WithLocalSvg
            width={30}
            height={15}
            asset={
              props.todayCount === 2 || props.isReached
                ? svgs.feanutVoltage
                : svgs.feanutLight
            }
            style={styles.voltage}
          />
          <WithLocalSvg
            width={30}
            height={15}
            asset={props.isReached ? svgs.feanutVoltage : svgs.feanutLight}
            style={styles.voltage}
          />
        </View>
      </Fragment>
    );
  };

  return (
    <View style={[styles.root, {marginTop: insets.top}]}>
      {(props.todayCount === 1 || props.todayCount === 2) && (
        <Fragment>
          <Gif source={gifs.hourglassNotDone} />
          <Text mt={30} align="center">
            {props.todayCount === 1 ? '다음' : '마지막'} 투표까지 남은 시간
          </Text>

          <Text size={43} weight="bold" mt={7}>
            {dayjs()
              .set('minutes', Math.floor(second / 60))
              .set('seconds', second % 60)
              .format('mm:ss')}
          </Text>
          {renderChildren()}
        </Fragment>
      )}

      {props.isReached && (
        <Information
          icon={gifs.highVoltage}
          message={'오늘의 칭찬 투표를 다 하셨군요!'}
          subMessage={`내일 더 다양한 주제의 투표에 참여할 수 있어요.`}
          markingText="다양한 주제">
          {renderChildren()}
        </Information>
      )}
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
