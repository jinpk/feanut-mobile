import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {MainTopBar} from '../components/top-bar/main';
import colors from '../libs/colors';
import {gifs} from '../libs/images';
import routes from '../libs/routes';
import FriendSyncTemplate from '../templates/friend-sync';
import LoadingTemplate from '../templates/loading';
import PollLockTemplate from '../templates/poll-lock';
import RewardTemplate from '../templates/reward';

function Home(): JSX.Element {
  const navigation = useNavigation();
  const [test, setTest] = useState(1);
  const [second, setSecond] = useState(13);

  const handleFindFriendByEmail = () => {};
  const handleKakaoSync = () => {
    setTest(2);
    let tm = setTimeout(() => {
      clearTimeout(tm);
      setTest(3);
      tm = setTimeout(() => {
        clearTimeout(tm);
        setTest(4);
        tm = setTimeout(() => {
          clearTimeout(tm);
          setSecond(0);
        }, 3000);
      }, 3000);
    }, 3000);
  };

  return (
    <View style={[styles.root]}>
      <MainTopBar
        onInboxPress={() => {
          navigation.navigate(routes.inbox);
        }}
        onProfilePress={() => {
          navigation.navigate(routes.profile);
        }}
      />
      {test === 1 && (
        <FriendSyncTemplate
          icon={gifs.teddyBear}
          title={'친구를 추가하고\n다양한 투표를 경험해 보세요!'}
          onFindByEamil={handleFindFriendByEmail}
          onKakaoSync={handleKakaoSync}
        />
      )}
      {test === 2 && <LoadingTemplate label="투표 불러오는 중" />}
      {test === 3 && (
        <RewardTemplate
          label="투표 불러오는 중"
          amount={12}
          totalAmount={100}
        />
      )}
      {test === 4 && <PollLockTemplate second={second} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.white},
});

export default Home;
