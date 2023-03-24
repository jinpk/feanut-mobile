import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, PanResponder, ScrollView, StyleSheet, View} from 'react-native';
import {gifs, constants} from '../../libs/common';
import {usePollingStore} from '../../libs/stores';
import PollingTemplate from '../../templates/polling';

type PollingsFeatureProps = {
  onFinish: () => void;
};

export const PollingsFeature = React.memo((props: PollingsFeatureProps) => {
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

  // stored poll information
  const storedPoll = useRef({
    currentPollIndex,
    poll,
    length: polls.length,
  });
  useEffect(() => {
    storedPoll.current = {
      currentPollIndex,
      poll,
      length: polls.length,
    };
  }, [currentPollIndex, poll, polls.length]);

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
        if (gestureX.current < -30) {
          if (
            storedPoll.current.poll?.skip ||
            storedPoll.current.poll?.selectedFriend
          ) {
            if (
              storedPoll.current.length ===
              storedPoll.current.currentPollIndex + 1
            ) {
              // finish poll
              handleFinishPolling();
            } else {
              // next poll
              scollRef.current?.scrollTo({
                animated: true,
                x:
                  constants.screenWidth *
                  (storedPoll.current.currentPollIndex + 1),
              });
              setPollIndex(storedPoll.current.currentPollIndex + 1);
            }
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
    if (
      storedPoll.current.poll?.skip ||
      storedPoll.current.poll?.selectedFriend
    ) {
      props.onFinish();
    }
  }, []);

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
        setPollIndex(i + 1);
      }
    },
    [polls.length],
  );

  return (
    <View {...slidePanResponder.panHandlers} style={styles.root}>
      <ScrollView
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
