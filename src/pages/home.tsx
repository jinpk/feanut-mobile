import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  useAnimatedValue,
} from 'react-native';
import {MainTopBar} from '../components/top-bar/main';
import {
  colors,
  constants,
  emotionBackgorundColor,
  gifs,
  routes,
} from '../libs/common';
import {useFriendStore, useModalStore, useUserStore} from '../libs/stores';
import LoadingTemplate from '../templates/loading';
import FriendSyncTemplate from '../templates/friend-sync';
import {usePolling} from '../hooks';
import {LineIndicator} from '../components';
import EventModalTemplate from '../templates/polling/event-modal';
import PollLockTemplate from '../templates/polling/lock';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {Polling} from '../components/poll';

const SCREEN_WIDTH = Dimensions.get('window').width;

function Home(): JSX.Element {
  const navigation = useNavigation();
  const focused = useIsFocused();

  const polling = usePolling();

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
        // 안드로이드 기본 제공 navigation bar 컬러와 흰색 배경시 navigation font color 변경 안되고 있음.
        changeNavigationBarColor(colors.white, true, true);
      }
    } else {
      StatusBar.setBarStyle('light-content');
      if (constants.platform === 'android') {
        StatusBar.setBackgroundColor(colors.dark);
        changeNavigationBarColor(colors.dark, false, true);
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

  /** 친구 화면에서 동기화하여 친구 4명 이상되면 라운드 조회 */
  useEffect(() => {
    if (polling.state === 'reject' && friendsTotalCount >= 4) {
      polling.reInit();
    }
  }, [polling.state, friendsTotalCount]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      animated: tabIndex !== 0,
      x: tabIndex * SCREEN_WIDTH,
    });
  }, [tabIndex]);

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
    <Animated.View style={[styles.root]}>
      {renderTopBar()}
      {polling.state === 'polling' && (
        <>
          {polling.pollings.map((item, index) => {
            const zIndex = polling.pollings.length - index;
            return (
              <Polling
                key={index.toString()}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  elevation: zIndex,
                  zIndex,
                }}
                emotion={item.emotion!}
                title={item.title!}
                iconURI={item.emojiURI!}
                friends={item.friends}
                selectedFriend={item.selectedProfileId}
                onNext={polling.vote}
                onSelected={(selectedProfileId: string) => {
                  polling.selectFriend(item.pollingId!, selectedProfileId);
                }}
                onSkip={() => {
                  polling.skip(item.pollingId!);
                }}
                onShuffle={() => {
                  polling.shuffle(item.pollingId!);
                }}
                focused={index === polling.currentPollingIndex}
                readyToFocus={index === polling.currentPollingIndex + 1}
              />
            );
          })}
          <LineIndicator
            length={polling.pollings.length}
            index={polling.currentPollingIndex}
          />
        </>
      )}

      {polling.state === 'loading' && (
        <LoadingTemplate label="투표 불러오는 중" />
      )}

      {polling.state === 'reject' && (
        <FriendSyncTemplate
          onSyncContacts={() => {
            navigation.navigate(routes.friend, {
              autoSync: true,
            });
          }}
          icon={gifs.teddyBear}
          title={'연락처를 동기화하여 친구를 추가할 수 있어요!'}
          message={
            '투표에 참여하려면 4명 이상의 친구가 등록되어 있어야 합니다.'
          }
        />
      )}

      {((polling.state === 'lock' && polling.remainTime) ||
        polling.state === 'reach') &&
        // 이벤트 보여줄떄는 대기
        !polling.event && (
          <PollLockTemplate
            maxDailyCount={polling.maxDailyCount}
            todayCount={polling.todayCount}
            remainTime={polling.remainTime || undefined}
            isReached={polling.state === 'reach'}
            onTimeout={() => {
              polling.reInit();
            }}
          />
        )}

      {polling.event && (
        <EventModalTemplate onClose={polling.clearEvent} {...polling.event} />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.white},
});

export default Home;
