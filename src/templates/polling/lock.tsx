import dayjs from 'dayjs';
import React, {Fragment, useEffect, useMemo, useRef, useState} from 'react';
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
      return '오늘의 칭찬 투표를 다 하셨군요!';
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
          subMessage={`수신함을 확인해 보세요.\n친구들이 나를 투표했을 수도 있어요!`}
          markingText="수신함을 확인">
          {renderChildren()}
        </Information>
      )}

      {props.todayCount === 2 && (
        <Information
          icon={gifs.hourglassNotDone}
          message={title}
          subMessage={`친구에게 마음을 표현하고 더 가까워져 볼까요?`}
          markingText="마음을 표현">
          {renderChildren()}
        </Information>
      )}

      {props.isReached && (
        <Information
          icon={gifs.highVoltage}
          message={title}
          subMessage={`내일 더 다양한 주제의 투표에 참여할 수 있어요!`}
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
