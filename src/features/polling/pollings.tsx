import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import constants from '../../libs/constants';
import {usePollingStore} from '../../store';
import PollingTemplate from '../../templates/polling';

export const PollingsFeature = React.memo(() => {
  const scollRef = useRef<ScrollView>(null);
  const polls = usePollingStore(s => s.polls);
  const currentPollIndex = usePollingStore(s => s.pollIndex);
  const setPollIndex = usePollingStore(s => s.actions.setPollIndex);
  const setPollSelected = usePollingStore(s => s.actions.setPollSelected);

  const poll = polls[currentPollIndex];

  const currentScrollOffsetX = useRef<number>(0);

  const scrollGuideState = useRef<boolean>(false);

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

  /**
   *   const handleFinishPolling = useCallback(() => {
    console.log('finish polling!');
    setTabIndex(2);
    let tm = setTimeout(() => {
      setTabIndex(3);
      clearTimeout(tm);
    }, 3000);
  }, []);

   */

  useEffect(() => {
    if (poll?.selectedFriend) {
      let tm = setTimeout(() => {
        scrollGuideState.current = true;
        const prevOffset = currentScrollOffsetX.current;
        scollRef.current?.scrollTo({
          x: prevOffset + 30,
          animated: true,
        });
        let tm = setTimeout(() => {
          clearTimeout(tm);
          scollRef.current?.scrollTo({
            x: prevOffset,
            animated: true,
          });
          scrollGuideState.current = false;
        }, 300);
      }, 1000);

      return () => {
        clearTimeout(tm);
      };
    }
  }, [poll?.selectedFriend, currentPollIndex]);

  const handleFriendSelected = useCallback(
    (value: string) => {
      if (scrollGuideState.current) {
        return;
      }

      setPollSelected(poll.id, value);
    },
    [poll],
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
        console.log('finish polling');
      }
      setPollIndex(
        Math.round(e.nativeEvent.contentOffset.x / constants.screenWidth),
      );
    },
    [],
  );

  return (
    <ScrollView
      onMomentumScrollEnd={handleScrollEnd}
      onScrollEndDrag={handleScrollEnd}
      horizontal
      ref={scollRef}
      pagingEnabled
      showsHorizontalScrollIndicator={false}>
      {polls.map((x, i) => {
        return (
          <View style={styles.container} key={i.toString()}>
            <PollingTemplate
              selectedFriend={x.selectedFriend}
              onFriendSelected={handleFriendSelected}
              emotion={x.emotion}
              focused={currentPollIndex === i}
              friends={friends}
            />
          </View>
        );
      })}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    width: constants.screenWidth,
  },
});
