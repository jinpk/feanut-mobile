import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {MainTopBar} from '../components/top-bar/main';
import {colors, constants, gifs, routes} from '../libs/common';
import {useFriendStore, useModalStore, useUserStore} from '../libs/stores';
import LoadingTemplate from '../templates/loading';
import FriendSyncTemplate from '../templates/friend-sync';
import {usePolling} from '../hooks';
import {LineIndicator} from '../components';
import EventModalTemplate from '../templates/polling/event-modal';
import PollLockTemplate from '../templates/polling/lock';
import {Polling} from '../components/poll';

const SCREEN_WIDTH = Dimensions.get('window').width;

function Home(): JSX.Element {
  const navigation = useNavigation();
  const focused = useIsFocused();

  const polling = usePolling();
  // 첫번쨰 투표 초기화 완료
  const [firstInited, setFirstInited] = useState(false);

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
      } else if (action === 'poll') {
        navigation.navigate(routes.home);
      }
      clearNotification();
    }
  }, [initialNotification]);

  const legacyFriendshipOpened = useModalStore(s => s.legacyFriendship);
  useEffect(() => {
    if (legacyFriendshipOpened) {
      return () => {
        // 재로딩
        polling.fetchRound();
      };
    }
  }, [legacyFriendshipOpened]);

  const welcomModalOpened = useModalStore(s => s.welcome);
  const friendsTotalCount = useFriendStore(s => s.friendsTotalCount);

  useEffect(() => {
    if (
      !firstInited ||
      welcomModalOpened ||
      !focused ||
      polling.event ||
      polling.state !== 'polling'
    ) {
      if (constants.platform === 'ios') {
        StatusBar.setBarStyle('dark-content');
      }
    } else {
      if (constants.platform === 'ios') {
        StatusBar.setBarStyle('light-content');
      }
    }
  }, [focused, welcomModalOpened, firstInited, polling.event, polling.state]);

  useEffect(() => {
    if (polling.state !== 'polling') {
      setFirstInited(false);
    }
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

  // 처음에 한번 호죄
  useEffect(() => {
    polling.fetchRound();
  }, []);

  const isTried = useRef(false);
  useEffect(() => {
    // 투표중이고 화면 포커스된 경우 최소 친구수 체크
    if (focused && polling.state === 'polling') {
      polling.requiredFriendsCount();
      // 되돌아와서 체크할때는 아래 로직 실행 안되도록 isTried: true 처리
      isTried.current = true;
    }

    // reject이고 화면 포커스된 경우 다시 조회
    const needToFetch = !polling.state || polling.state === 'reject';
    if (focused && needToFetch && !isTried.current) {
      polling.fetchRound();
      isTried.current = true;
    }

    if (!focused) {
      isTried.current = false;
    }
  }, [focused, polling.state]);

  useEffect(() => {
    if (polling.state === 'reject' && friendsTotalCount >= 4) {
      polling.fetchRound();
    }
  }, [polling.state, friendsTotalCount]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      animated: tabIndex !== 0,
      x: tabIndex * SCREEN_WIDTH,
    });
  }, [tabIndex]);

  const handleInboxPress = useCallback(() => {
    navigation.navigate(routes.inbox);
  }, []);

  const handleProfilePress = useCallback(() => {
    navigation.navigate(routes.profile);
  }, []);

  const renderTopBar = useCallback(() => {
    const last = polling.currentPollingIndex === polling.pollings.length - 1;

    return (
      <MainTopBar
        zIndex={last ? 1 : 50}
        white={last ? false : polling.state === 'polling' && firstInited}
        hideLogo={last ? false : polling.state === 'polling'}
        onInboxPress={handleInboxPress}
        onProfilePress={handleProfilePress}
      />
    );
  }, [navigation, firstInited, polling]);

  return (
    <Animated.View style={[styles.root]}>
      {renderTopBar()}

      {polling.state === 'polling' && (
        <>
          <LineIndicator
            length={polling.pollings.length}
            index={polling.currentPollingIndex}
          />
          {polling.pollings.map((item, index) => {
            const zIndex = polling.pollings.length - index;

            // 이미 지니간 투표는 UI 그리지 않음.
            if (index < polling.currentPollingIndex) {
              return null;
            }
            return (
              <Polling
                onInboxPress={handleInboxPress}
                onProfilePress={handleProfilePress}
                index={index}
                initialIndex={polling.initialIndex}
                latest={index === polling.pollings.length - 1}
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
                onFirstInited={() => {
                  setFirstInited(true);
                }}
                emotion={item.emotion!}
                title={item.title!}
                iconURI={item.emojiURI!}
                firstInited={firstInited}
                friends={item.friends}
                selectedFriend={item.selectedProfileId}
                onNext={polling.vote}
                onSelected={(selectedProfileId: string) => {
                  polling.selectFriend(item.pollingId!, selectedProfileId);
                }}
                onShuffle={() => {
                  polling.shuffle(item.pollingId!);
                }}
                focused={index === polling.currentPollingIndex}
                readyToFocus={index === polling.currentPollingIndex + 1}
              />
            );
          })}
        </>
      )}

      {/** event 준비중일떄 loading bar hide */}
      {polling.state === 'loading' && !polling.event && (
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
          title={'친구를 추가하고\n다양한 주제의 투표를 경험해 보세요!'}
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
              polling.fetchRound();
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
