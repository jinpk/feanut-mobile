import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PanResponder,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import constants from '../../libs/constants';
import {gifs} from '../../libs/images';
import {usePollingStore} from '../../store';
import PollingTemplate from '../../templates/polling';

export const PollingsFeature = React.memo(() => {
  const scollRef = useRef<ScrollView>(null);
  const polls = usePollingStore(s => s.polls);
  const currentPollIndex = usePollingStore(s => s.pollIndex);
  const setPollIndex = usePollingStore(s => s.actions.setPollIndex);
  const setPollSelected = usePollingStore(s => s.actions.setPollSelected);
  const skipPoll = usePollingStore(s => s.actions.skipPoll);

  const poll = polls[currentPollIndex];

  const currentScrollOffsetX = useRef<number>(0);

  const [friends, setFriends] = useState([
    {
      value: '1',
    },
    {
      value: '2',
    },
    {
      value: '3',
    },
    {
      value: '4',
    },
  ]);

  const storedPoll = useRef({
    currentPollIndex,
    poll,
  });
  useEffect(() => {
    storedPoll.current = {
      currentPollIndex,
      poll,
    };
  }, [currentPollIndex, poll]);

  const gestureX = useRef(0);
  const slidePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onShouldBlockNativeResponder: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        gestureX.current = 0;
      },
      onPanResponderMove: (evt, gestureState) => {
        gestureX.current = gestureState.dx;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (Math.abs(gestureState.dx) < 5) {
          console.log('is touced');
          evt.preventDefault();
          evt.stopPropagation();
          evt.persist();
        }
        if (gestureX.current < -30) {
          console.log('next poll');
          if (
            storedPoll.current.poll.skip ||
            storedPoll.current.poll.selectedFriend
          ) {
            scollRef.current?.scrollTo({
              animated: true,
              x:
                constants.screenWidth *
                (storedPoll.current.currentPollIndex + 1),
            });
          } else {
            Alert.alert('알림', '질문을 건너뛰거나 친구를 투표하세요!');
          }
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {
        gestureX.current = 0;
      },
    }),
  ).current;

  const handleFinishPolling = useCallback(() => {
    console.log('finish polling');
  }, [polls, currentPollIndex]);

  // 첫번째 투표에서만 친구 선택하면 다음 투표 스크롤 가이드
  useEffect(() => {
    let tm: number;
    if (poll?.selectedFriend && currentPollIndex === 0) {
      tm = setTimeout(() => {
        clearTimeout(tm);

        const prevOffset = currentScrollOffsetX.current;
        scollRef.current?.scrollTo({
          x: prevOffset + 30,
          animated: true,
        });

        tm = setTimeout(() => {
          clearTimeout(tm);

          scollRef.current?.scrollTo({
            x: prevOffset,
            animated: true,
          });
        }, 300);
      }, 1000);
    }
    return () => {
      if (tm) {
        clearTimeout(tm);
      }
    };
  }, [poll?.selectedFriend, currentPollIndex]);

  const handleFriendSelected = useCallback(
    (value: string) => {
      setPollSelected(poll.id, value);
    },
    [poll],
  );

  const handleSkip = useCallback(
    (poll: any, i: number) => () => {
      skipPoll(poll.id);
      setPollSelected(poll.id, '');

      if (polls.length - 1 <= i) {
        handleFinishPolling();
      } else {
        scollRef.current?.scrollTo({
          animated: true,
          x: constants.screenWidth * (i + 1),
        });
      }
    },
    [polls.length],
  );

  const handleScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      currentScrollOffsetX.current = e.nativeEvent.contentOffset.x;
      if (
        e.nativeEvent.contentOffset.x -
          (e.nativeEvent.contentSize.width -
            e.nativeEvent.layoutMeasurement.width) >=
        10
      ) {
        handleFinishPolling();
      }
      setPollIndex(
        Math.round(e.nativeEvent.contentOffset.x / constants.screenWidth),
      );
    },
    [handleFinishPolling],
  );

  return (
    <View {...slidePanResponder.panHandlers} style={styles.root}>
      <ScrollView
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        horizontal
        ref={scollRef}
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}>
        {polls.map((x, i) => {
          return (
            <View style={styles.container} key={i.toString()}>
              <PollingTemplate
                selectedFriend={x.selectedFriend}
                onFriendSelected={handleFriendSelected}
                emotion={x.emotion}
                friends={friends}
                title={'심적으로 나를\n편안하게 만들어 주는 친구는?'}
                icon={gifs.fire}
                onShuffle={() => {}}
                onSkip={handleSkip(x, i)}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    width: constants.screenWidth,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  container: {
    width: constants.screenWidth,
  },
});
