import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {MainTopBar} from '../components/top-bar/main';
import {PollingIndicatorFeautre} from '../features/polling';
import {PollingsFeature} from '../features/polling/pollings';
import {colors, gifs, routes} from '../libs/common';
import {useModalStore, usePollingStore, useUserStore} from '../libs/stores';
import LoadingTemplate from '../templates/loading';
import PollLockTemplate from '../templates/poll-lock';
import RewardTemplate from '../templates/reward';
import FriendSyncTemplate from '../templates/friend-sync';
import {getHasFriends} from '../libs/api/friendship';
import {usePolling, useSyncContacts} from '../hooks';

const SCREEN_WIDTH = Dimensions.get('window').width;

function Home(): JSX.Element {
  const polling2 = usePolling();

  const navigation = useNavigation();
  const userId = useUserStore(s => s.user?.id);

  const scrollRef = useRef<ScrollView>(null);
  const [tabIndex, setTabIndex] = useState(0);

  // polling
  const pollingActions = usePollingStore(s => s.actions);

  /** 현재 투표중인지 여부 */
  const focused = useIsFocused();
  const polling = useMemo(() => tabIndex === 1, [tabIndex]);

  const [needMoreFriends, setNeedMoreFriends] = useState(true);

  const syncContacts = useSyncContacts();

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

  const init = useCallback(async () => {
    if (!userId) return;

    pollingActions.setLoading(true);
    try {
      const hasFriends = await getHasFriends(userId);
      setNeedMoreFriends(!hasFriends);

      if (hasFriends) {
        //Alert.alert('투표 불러오기!! 개발중');
      }
    } catch (error: any) {
      Alert.alert(error.message || error);
    }
    pollingActions.setLoading(false);
  }, [userId]);

  useEffect(() => {
    init();
  }, [userId]);

  //pollingActions.setPollIndex(0);
  //setTabIndex(1);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      animated: true,
      x: tabIndex * SCREEN_WIDTH,
    });
  }, [tabIndex]);

  const handleFinishPolling = useCallback(() => {
    setTabIndex(2);
    let tm = setTimeout(() => {
      clearTimeout(tm);
      setTabIndex(3);
    }, 2000);
  }, []);

  const handleInboxPress = useCallback(() => {
    Alert.alert('수신함!! 개발중');
    return;
    navigation.navigate(routes.inbox);
  }, []);

  const handleProfilePress = useCallback(() => {
    navigation.navigate(routes.profile);
  }, []);

  const handleSyncContacts = () => {
    syncContacts.syncContacts(() => {
      init();
    });
  };

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
          {!needMoreFriends && <LoadingTemplate label="투표 불러오는 중" />}
          {needMoreFriends && (
            <FriendSyncTemplate
              onSyncContacts={handleSyncContacts}
              icon={gifs.teddyBear}
              title={'친구를 추가하고\n다양한 투표를 경험해 보세요!'}
            />
          )}
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
