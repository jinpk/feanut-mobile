import dayjs from 'dayjs';
import React, {Fragment, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WithLocalSvg} from 'react-native-svg';
import {Text} from '../../components/text';
import {gifs, svgs} from '../../libs/common';
import {Information} from '../../components';

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

  useEffect(() => {
    if (!props.remainTime || props.isReached) return;

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
  }, [props.remainTime, props.isReached]);

  const renderChildren = () => {
    return (
      <Fragment>
        {!props.isReached && (
          <Fragment>
            <Text mt={30} align="center">
              다음 투표까지
            </Text>

            <Text size={27} weight="bold" mt={7}>
              {dayjs()
                .set('minutes', Math.floor(second / 60))
                .set('seconds', second % 60)
                .format('mm:ss')}
            </Text>
          </Fragment>
        )}
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

  const title = useMemo(() => {
    if (props.isReached) {
      return '오늘의 칭찬 투표를 전부 하셨군요!';
    }
    switch (props.todayCount) {
      case 1:
        return '오늘의 첫 칭찬 투표를 완료 하셨군요!';
      default:
        return `오늘 ${props.todayCount}번이나 친구들을 칭찬했어요!`;
    }
  }, [props.todayCount, props.isReached]);

  return (
    <View style={[styles.root, {marginTop: insets.top}]}>
      {props.todayCount === 1 && (
        <Information
          icon={gifs.hourglassNotDone}
          message={title}
          subMessage={`하루에 ${props.maxDailyCount}번만 참여할 수 있어요.`}
          markingText="투표가 준비">
          {renderChildren()}
        </Information>
      )}

      {props.todayCount === 2 && (
        <Information
          icon={gifs.hourglassNotDone}
          message={title}
          subMessage={`마지막 투표도 곧 참여할 수 있어요.`}
          markingText="마지막 투표">
          {renderChildren()}
        </Information>
      )}

      {props.isReached && (
        <Information
          icon={gifs.hourglassNotDone}
          message={title}
          subMessage={`투표는 하루에 ${props.maxDailyCount}번만 참여할 수 있어요.`}
          markingText="투표가 준비">
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
