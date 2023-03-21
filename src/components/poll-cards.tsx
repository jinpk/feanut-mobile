import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import emotions from '../libs/emotions';
import {PollCard} from './poll-card';

export const PollCards = (): JSX.Element => {
  const scrollRef = useRef<ScrollView>(null);
  const [currentScrollX, setCurrentScrollX] = useState(0);
  const [maxScrollX, setMaxScrollX] = useState(0);

  useEffect(() => {
    if (currentScrollX >= maxScrollX) {
      return setCurrentScrollX(0);
    }
    scrollRef.current?.scrollTo({animated: true, x: currentScrollX + 10});
  }, [currentScrollX, maxScrollX]);

  return (
    <View style={styles.root}>
      <ScrollView
        ref={scrollRef}
        onMomentumScrollEnd={e => {
          setCurrentScrollX(e.nativeEvent.contentOffset.x);
          setMaxScrollX(
            e.nativeEvent.contentSize.width -
              e.nativeEvent.layoutMeasurement.width,
          );
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.polls}>
        <PollCard ml={16} emotion={emotions.pride} />
        <PollCard ml={16} emotion={emotions.happiness} />
        <PollCard ml={15} emotion={emotions.amusement} />
        <PollCard ml={15} emotion={emotions.gratitude} />
        <PollCard ml={15} emotion={emotions.inspiration} />
        <PollCard ml={15} emotion={emotions.serenity} />
        <PollCard ml={15} emotion={emotions.awe} />
        <PollCard ml={15} emotion={emotions.interest} />
        <PollCard ml={15} emotion={emotions.love} />
        <PollCard ml={15} emotion={emotions.hope} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  polls: {
    width: '100%',
  },
  root: {
    height: 149,
  },
});
