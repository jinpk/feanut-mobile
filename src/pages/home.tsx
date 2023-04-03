import React, {useCallback, useEffect, useRef, useState} from 'react';
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
import {colors, constants, gifs, routes} from '../libs/common';
import {useFriendStore, useModalStore, useUserStore} from '../libs/stores';
import LoadingTemplate from '../templates/loading';
import FriendSyncTemplate from '../templates/friend-sync';
import {usePolling, useSyncContacts} from '../hooks';
import {LineIndicator} from '../components';
import PollingsTemplate from '../templates/polling/pollings';
import EventModalTemplate from '../templates/polling/event-modal';
import PollReachTemplate from '../templates/polling/reach';
import PollLockTemplate from '../templates/polling/lock';

const SCREEN_WIDTH = Dimensions.get('window').width;

function Home(): JSX.Element {
  const navigation = useNavigation();
  const focused = useIsFocused();

  const polling = usePolling();
  const syncContacts = useSyncContacts();

  const scrollRef = useRef<ScrollView>(null);
  const [tabIndex, setTabIndex] = useState(0);

  // 초기 알림 클릭 이벤트처리
  const initialNotification = useUserStore(s => s.notification);
  const clearNotification = useUserStore(s => s.actions.clearNotification);
  useEffect(() => {
    if (initialNotification) {
      const {action, value} = initialNotification;
      if (action === 'pull') {
        navigation.navigate(routes.inbox);
        navigation.navigate(routes.inboxDetail, {pollingId: value});
        clearNotification();
      }
    }
  }, [initialNotification]);

  const welcomModalOpened = useModalStore(s => s.welcome);
  const friendsTotalCount = useFriendStore(s => s.friendsTotalCount);

  useEffect(() => {
    if (
      welcomModalOpened ||
      !focused ||
      polling.event ||
      polling.state !== 'polling'
    ) {
      StatusBar.setBarStyle('dark-content');
      if (constants.platform === 'android') {
        StatusBar.setBackgroundColor('#fff');
      }
    } else {
      StatusBar.setBarStyle('light-content');
      if (constants.platform === 'android') {
        StatusBar.setBackgroundColor('#000');
      }
    }
  }, [focused, welcomModalOpened, polling.event, polling.state]);

  useEffect(() => {
    switch (polling.state) {
      case 'loading':
        setTabIndex(0);
        break;
      case 'reject':
      case 'polling':
        setTabIndex(1);
        break;
      case 'lock':
      case 'reach':
        setTabIndex(2);
        break;
    }
  }, [polling.state]);

  useEffect(() => {
    if (focused && polling.state === 'reject' && friendsTotalCount >= 4) {
      polling.reInit();
    }
  }, [focused, polling.state, friendsTotalCount]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      animated: tabIndex !== 0,
      x: tabIndex * SCREEN_WIDTH,
    });
  }, [tabIndex]);

  const handleSyncContacts = useCallback(() => {
    if (syncContacts.loading) {
      return Alert.alert(
        '연락처 동기화중 ...',
        'feanut이 회원님의 연락처를 읽어와 친구로 추가하고 있으니 잠시만 기다려주세요.',
      );
    }
    syncContacts.syncContacts(() => {
      polling.reInit();
    });
  }, [syncContacts, polling.reInit]);

  const renderTopBar = useCallback(() => {
    const handleInboxPress = () => {
      navigation.navigate(routes.inbox);
    };

    const handleProfilePress = () => {
      navigation.navigate(routes.profile);
    };

    return (
      <MainTopBar
        polling={polling.state === 'polling'}
        onInboxPress={handleInboxPress}
        onProfilePress={handleProfilePress}
      />
    );
  }, [navigation, polling.state]);

  return (
    <View style={styles.root}>
      {renderTopBar()}
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
        <View style={styles.pollContainer}>
          {polling.state === 'reject' && (
            <FriendSyncTemplate
              onSyncContacts={handleSyncContacts}
              icon={gifs.teddyBear}
              title={'친구를 추가하고\n다양한 투표를 경험해 보세요!'}
              message={
                '4명 이상의 친구가 있어야 참여할 수 있어요!\n연락처를 동기화하여 친구를 추가할 수 있습니다.'
              }
            />
          )}
          {polling.state === 'polling' && (
            <View style={styles.polls}>
              <PollingsTemplate
                pollings={polling.pollings}
                currentPollingIndex={polling.currentPollingIndex}
                onVote={polling.vote}
                onFriendSelected={polling.selectFriend}
                onSkip={polling.skip}
                onShuffle={polling.shuffle}
                initialPollingIndex={polling.initialIndex}
              />
              <LineIndicator
                length={polling.pollings.length}
                index={polling.currentPollingIndex}
              />
            </View>
          )}
        </View>
        <View style={styles.pollContainer}>
          {polling.state === 'reach' && (
            <PollReachTemplate maxDailyCount={polling.maxDailyCount} />
          )}
          {polling.state === 'lock' && polling.remainTime && (
            <PollLockTemplate
              maxDailyCount={polling.maxDailyCount}
              todayCount={polling.todayCount}
              remainTime={polling.remainTime}
              onTimeout={() => {
                polling.reInit();
              }}
            />
          )}
        </View>
      </ScrollView>

      {polling.event && (
        <EventModalTemplate onClose={polling.clearEvent} {...polling.event} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.white},
  pollContainer: {
    width: SCREEN_WIDTH,
  },
  polls: {
    flex: 1,
  },
});

export default Home;
