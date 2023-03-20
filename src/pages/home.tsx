import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  useAnimatedValue,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MainTopBar} from '../components/top-bar/main';
import colors from '../libs/colors';
import emotions from '../libs/emotions';
import routes from '../libs/routes';
import {usePollingStore} from '../store';
import LoadingTemplate from '../templates/loading';
import PollLockTemplate from '../templates/poll-lock';
import PollingTemplate from '../templates/polling';
import RewardTemplate from '../templates/reward';

const SCREEN_WIDTH = Dimensions.get('window').width;

function Home(): JSX.Element {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const scrollRef = useRef<ScrollView>(null);
  const [tabIndex, setTabIndex] = useState(0);

  // polling
  const pollingActions = usePollingStore(s => s.actions);
  const polls = usePollingStore(s => s.polls);
  const currentPollIndex = usePollingStore(s => s.pollIndex);
  const loading = usePollingStore(s => s.loading);

  /** 현재 투표중인지 여부 */
  const polling = useMemo(() => tabIndex === 1, [tabIndex]);

  useEffect(() => {
    pollingActions.setLoading(true);
    let tm = setTimeout(() => {
      pollingActions.setPolls([
        {emotion: emotions.amusement},
        {emotion: emotions.awe},
        {emotion: emotions.gratitude},
        {emotion: emotions.happiness},
        {emotion: emotions.hope},
        {emotion: emotions.inspiration},
        {emotion: emotions.interest},
        {emotion: emotions.love},
        {emotion: emotions.pride},
        {emotion: emotions.serenity},
      ]);
      pollingActions.setLoading(false);
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

  /** Polls Indicator hooks */
  const indicatorWidth = useAnimatedValue(0);
  useEffect(() => {
    if (!polling) {
      indicatorWidth.setValue(0);
      return;
    }
    const barWidth =
      Math.ceil((SCREEN_WIDTH - 32) / polls.length) * (currentPollIndex + 1);
    console.log(barWidth, (SCREEN_WIDTH - 32) / polls.length, currentPollIndex);
    const toValue = barWidth || 0;
    Animated.timing(indicatorWidth, {
      duration: 300,
      toValue,
      easing: Easing.bounce,
      useNativeDriver: false,
    }).start(r => {
      if (!r.finished) {
        indicatorWidth.setValue(toValue);
      }
    });
  }, [currentPollIndex, polling, polls.length]);

  const handleFindFriendByEmail = () => {};
  const handleKakaoSync = () => {};

  const handleFinishPolling = useCallback(() => {
    console.log('finish polling!');
    setTabIndex(2);
    let tm = setTimeout(() => {
      setTabIndex(3);
      clearTimeout(tm);
    }, 3000);
  }, []);

  const handleScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (
        e.nativeEvent.contentOffset.x -
          (e.nativeEvent.contentSize.width -
            e.nativeEvent.layoutMeasurement.width) >=
        10
      ) {
        handleFinishPolling();
      }
      pollingActions.setPollIndex(
        Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH),
      );
    },
    [handleFinishPolling],
  );

  const handleInboxPress = useCallback(() => {
    navigation.navigate(routes.inbox);
  }, []);
  const handleProfilePress = useCallback(() => {
    navigation.navigate(routes.profile);
    navigation.navigate(routes.inbox);
  }, []);

  const renderPolls = useCallback(() => {
    return polls.map((x, i) => {
      return (
        <View style={styles.pollContainer} key={i.toString()}>
          <PollingTemplate
            emotion={x.emotion}
            focused={currentPollIndex === i}
          />
        </View>
      );
    });
  }, [polls, currentPollIndex]);

  const renderPollIndicator = useCallback(() => {
    return (
      <View style={[styles.indicator, {top: insets.top + 50 + 9}]}>
        <Animated.View style={[styles.indicatorBar, {width: indicatorWidth}]} />
      </View>
    );
  }, [insets]);

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
          <ScrollView
            onMomentumScrollEnd={handleScrollEnd}
            onScrollEndDrag={handleScrollEnd}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}>
            {renderPolls()}
          </ScrollView>
          {renderPollIndicator()}
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

  indicator: {
    zIndex: 2,
    left: 16,
    right: 16,
    backgroundColor: colors.lightGrey + '59',
    borderRadius: 15,
    height: 3,
    position: 'absolute',
  },
  indicatorBar: {
    height: '100%',
    backgroundColor: colors.lightGrey + 'BF',
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
