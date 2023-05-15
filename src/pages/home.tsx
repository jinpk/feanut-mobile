import React, {useCallback, useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Animated, StatusBar, StyleSheet} from 'react-native';
import {colors, constants, routes} from '../libs/common';
import {useModalStore, useUserStore} from '../libs/stores';
import LoadingTemplate from '../templates/loading';
import {usePolling} from '../hooks';
import {LineIndicator} from '../components';
import EventModalTemplate from '../templates/polling/event-modal';
import PollLockTemplate from '../templates/polling/lock';
import {Polling} from '../components/poll';
import {MainTopBar} from '../components/top-bar/main';
import {InternalPolling} from '../libs/interfaces/polling';
import PollReadyTemplate from '../templates/poll-ready';
//import HomeFloating from '../components/home-floating';
//import {useInviteFriend} from '../hooks/use-invite-friend';

function Home(): JSX.Element {
  const navigation = useNavigation();
  const focused = useIsFocused();

  const polling = usePolling();
  // 첫번쨰 투표 초기화 완료
  const [firstInited, setFirstInited] = useState(false);

  /** 알림 클릭 이벤트처리 */
  const initialNotification = useUserStore(s => s.notification);
  const clearNotification = useUserStore(s => s.actions.clearNotification);
  useEffect(() => {
    if (initialNotification) {
      const {action, value} = initialNotification;
      if (action === 'pull') {
        navigation.navigate(routes.inboxDetail, {pollingId: value});
      } else if (action === 'poll') {
        navigation.navigate(routes.home);
      }
      clearNotification();
    }
  }, [initialNotification]);

  const welcomModalOpened = useModalStore(s => s.welcome);

  /** Status Bar Color handling */
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
  }, [polling.state]);

  useEffect(() => {
    polling.checkRoundLockOrReach();
  }, []);

  // const inviteFriend = useInviteFriend();

  /** render 투표 화면 */
  const renderPolling = useCallback(
    (item: InternalPolling, index: number) => {
      const zIndex = polling.pollings.length - index;
      // 이미 지니간 투표는 UI 그리지 않음.
      if (index < polling.currentPollingIndex) {
        return null;
      }
      return (
        <Polling
          index={index}
          initialIndex={polling.initialIndex}
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
    },
    [polling, firstInited],
  );

  return (
    <Animated.View style={[styles.root]}>
      {polling.state !== 'polling' && <MainTopBar />}

      {/** 투표 대기 화면 */}
      {!polling.state && (
        <PollReadyTemplate
          onSchoolVote={() => {
            polling.setVoteTarget('school');
            polling.fetchRound();
          }}
          onFriendVote={() => {
            polling.setVoteTarget('friend');
            polling.fetchRound();
          }}
        />
      )}

      {/** 투표 화면 */}
      {polling.state === 'polling' && (
        <>
          <LineIndicator
            length={polling.pollings.length}
            index={polling.currentPollingIndex}
          />
          {polling.pollings.map(renderPolling)}
        </>
      )}

      {/** 투표 로딩 화면 */}
      {polling.state === 'loading' && <LoadingTemplate />}

      {/** 투표 쿨타임 화면 */}
      {((polling.state === 'lock' && polling.remainTime) ||
        polling.state === 'reach') &&
        // 이벤트 보여줄떄는 대기
        !polling.event && (
          <PollLockTemplate
            maxDailyCount={polling.maxDailyCount}
            todayCount={polling.todayCount}
            remainTime={polling.remainTime || undefined}
            isReached={polling.state === 'reach'}
            onTimeout={polling.init}
          />
        )}

      {/** 투표 완료 후 리워드 화면 */}
      {polling.event && (
        <EventModalTemplate onClose={polling.clearEvent} {...polling.event} />
      )}

      {/** TODO: 바텀 바 변경 되면서 굳이 필요한 버튼인가? */}
      {/**
      {((polling.state === 'lock' && polling.remainTime) ||
        polling.state === 'reach') && (
        <HomeFloating
          onAddFriend={() => {
            navigation.navigate(routes.friendStack, {add: true});
          }}
          onInvite={inviteFriend}
        />
      )}
       */}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.white},
});

export default Home;
