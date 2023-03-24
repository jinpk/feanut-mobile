import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {MainTopBar} from '../components/top-bar/main';
import {PollingIndicatorFeautre} from '../features/polling';
import {PollingsFeature} from '../features/polling/pollings';
import {colors, emotions, routes} from '../libs/common';
import {useModalStore, usePollingStore} from '../libs/stores';
import LoadingTemplate from '../templates/loading';
import PollLockTemplate from '../templates/poll-lock';
import RewardTemplate from '../templates/reward';

const SCREEN_WIDTH = Dimensions.get('window').width;

function Home(): JSX.Element {
  const navigation = useNavigation();

  const scrollRef = useRef<ScrollView>(null);
  const [tabIndex, setTabIndex] = useState(0);

  // polling
  const pollingActions = usePollingStore(s => s.actions);

  /** 현재 투표중인지 여부 */
  const focused = useIsFocused();
  const polling = useMemo(() => tabIndex === 1, [tabIndex]);

  const welcomModalOpened = useModalStore(s => s.welcome);
  useEffect(() => {
    StatusBar.setBarStyle(
      welcomModalOpened
        ? 'dark-content'
        : !focused || !polling
        ? 'dark-content'
        : 'light-content',
    );
  }, [polling, focused, welcomModalOpened]);

  useEffect(() => {
    pollingActions.setLoading(true);
    let tm = setTimeout(() => {
      pollingActions.setPolls([
        {
          id: emotions.amusement,
          polling: {},
          selectedFriend: null,
          emotion: emotions.amusement,
        },
        {
          id: emotions.awe,
          polling: {},
          selectedFriend: null,
          emotion: emotions.awe,
        },
        {
          id: emotions.gratitude,
          polling: {},
          selectedFriend: null,
          emotion: emotions.gratitude,
        },
        {
          id: emotions.happiness,
          polling: {},
          selectedFriend: null,
          emotion: emotions.happiness,
        },
        {
          id: emotions.hope,
          polling: {},
          selectedFriend: null,
          emotion: emotions.hope,
        },
        {
          id: emotions.inspiration,
          polling: {},
          selectedFriend: null,
          emotion: emotions.inspiration,
        },
        {
          id: emotions.interest,
          polling: {},
          selectedFriend: null,
          emotion: emotions.interest,
        },
        {
          id: emotions.love,
          polling: {},
          selectedFriend: null,
          emotion: emotions.love,
        },
        {
          id: emotions.pride,
          polling: {},
          selectedFriend: null,
          emotion: emotions.pride,
        },
        {
          id: emotions.serenity,
          polling: {},
          selectedFriend: null,
          emotion: emotions.serenity,
        },
      ]);
      pollingActions.setLoading(false);
      pollingActions.setPollIndex(0);
      setTabIndex(1);
    }, 3000);
    return () => {
      clearTimeout(tm);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      animated: true,
      x: tabIndex * SCREEN_WIDTH,
    });
  }, [tabIndex]);

  const handleFindFriendByEmail = () => {};
  const handleKakaoSync = () => {};

  const handleFinishPolling = useCallback(() => {
    setTabIndex(2);
    let tm = setTimeout(() => {
      clearTimeout(tm);
      setTabIndex(3);
    }, 2000);
  }, []);

  const handleInboxPress = useCallback(() => {
    navigation.navigate(routes.inbox);
  }, []);
  const handleProfilePress = useCallback(() => {
    navigation.navigate(routes.profile);
  }, []);

  return (
    <View style={styles.root}>
      <MainTopBar
        polling={polling}
        onInboxPress={handleInboxPress}
        onProfilePress={handleProfilePress}
      />

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}>
        {/** Loading */}
        <View style={styles.pollContainer}>
          <LoadingTemplate label="투표 불러오는 중" />
        </View>

        <View style={styles.polls}>
          <PollingsFeature onFinish={handleFinishPolling} />
          <PollingIndicatorFeautre />
        </View>

        {/** Reward */}
        <View style={styles.pollContainer}>
          <RewardTemplate amount={12} totalAmount={100} />
        </View>

        {/** CoolTime */}
        <View style={styles.pollContainer}>
          <PollLockTemplate second={60 * 17} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.white},
  pollContainer: {
    width: SCREEN_WIDTH,
  },
  polls: {
    backgroundColor: colors.primary,
    width: SCREEN_WIDTH,
    flex: 1,
  },
});

export default Home;

/** {test === 1 && (
        <FriendSyncTemplate
          icon={gifs.teddyBear}
          title={'친구를 추가하고\n다양한 투표를 경험해 보세요!'}
          onFindByEamil={handleFindFriendByEmail}
          onKakaoSync={handleKakaoSync}
        />
      )}
      {test === 4 && <PollLockTemplate second={60 * 17} />}*/
