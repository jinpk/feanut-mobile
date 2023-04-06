import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Linking, StyleSheet, View} from 'react-native';
import {BackTopBar} from '../../components/top-bar';
import {useCoin, useNotificationUserConfig} from '../../hooks';
import {getFriendshipStatus} from '../../libs/api/friendship';
import {getMyProfile, patchProfile} from '../../libs/api/profile';
import {colors, routes} from '../../libs/common';
import {configs} from '../../libs/common/configs';
import {useProfileStore, useUserStore} from '../../libs/stores';
import {InstagramModalTemplate} from '../../templates/modal';
import ProfileTemplate from '../../templates/profile';

function Profile(): JSX.Element {
  const navigation = useNavigation();
  const userId = useUserStore(s => s.user?.id);
  const logout = useUserStore(s => s.actions.logout);
  const focused = useIsFocused();
  const profile = useProfileStore(s => s.profile);
  const update = useProfileStore(s => s.actions.update);

  const [friendsCount, setFriendsCount] = useState(0);

  const [instagramModal, setInstagramModal] = useState(false);

  const coin = useCoin();

  const notificationUserConfig = useNotificationUserConfig();

  const fetchMyProfile = async () => {
    const profile = await getMyProfile();
    return profile;
  };

  const fetchFriendshipStatus = async () => {
    const profile = await getFriendshipStatus(userId!);
    return profile;
  };

  const fetchProfile = useCallback(async () => {
    try {
      const profile = await fetchMyProfile();
      update(profile);
    } catch (error: any) {
      Alert.alert(error.message || error);
    }
  }, []);

  // 프로필 조회
  useEffect(() => {
    if (!focused) {
      return;
    }
    fetchProfile();
  }, [focused]);

  // 친구 조회
  useEffect(() => {
    if (!focused || !userId) {
      return;
    }

    fetchFriendshipStatus()
      .then(result => {
        setFriendsCount(result.friendsCount);
      })
      .catch((error: any) => {
        Alert.alert(error.message || error);
      });
  }, [focused, userId]);

  const handleEditProfile = useCallback(() => {
    navigation.navigate(routes.profileEdit);
  }, []);

  const clearInstagram = useCallback(async () => {
    try {
      await patchProfile(profile.id, {instagram: ''});
      fetchProfile();
    } catch (error: any) {
      Alert.alert(error.message || error);
    }
  }, [profile.id]);

  const handleInstagram = useCallback(
    (on: boolean) => {
      if (on) {
        setInstagramModal(true);
      } else {
        Alert.alert('인스타그램 계정연동 해지 하시겠습니까?', '', [
          {
            style: 'destructive',
            text: '취소',
          },
          {
            style: 'cancel',
            text: '확인',
            onPress: clearInstagram,
          },
        ]);
      }
    },
    [profile.instagram],
  );

  const handleService = useCallback(() => {
    Linking.openURL(configs.websiteUrl);
  }, []);

  const handlePrivacy = useCallback(() => {
    Linking.openURL(configs.privacyUrl);
  }, []);

  const handleTerms = useCallback(() => {
    Linking.openURL(configs.termsUrl);
  }, []);

  const handleWithdrawal = useCallback(() => {
    navigation.navigate(routes.deleteMe);
  }, []);

  const handleCard = useCallback(() => {
    navigation.navigate(routes.feanutCard, {profileId: profile.id});
  }, [profile.id]);

  const handleFriend = useCallback(() => {
    navigation.navigate(routes.friend);
  }, []);

  return (
    <View style={styles.root}>
      <BackTopBar logo onBack={navigation.goBack} />
      {Boolean(profile) && (
        <ProfileTemplate
          friendsCount={friendsCount}
          onEditProfile={handleEditProfile}
          profile={profile}
          onLogout={logout}
          feanutAmount={coin.amount}
          onPurchaseFeanut={coin.openPurchaseModal}
          onInstagram={handleInstagram}
          onPrivacy={handlePrivacy}
          onTerms={handleTerms}
          onService={handleService}
          onWithdrawal={handleWithdrawal}
          receivePull={notificationUserConfig.config.receivePull}
          receivePoll={notificationUserConfig.config.receivePoll}
          onReceivePoll={notificationUserConfig.changePoll}
          onReceivePull={notificationUserConfig.changePull}
          onCard={handleCard}
          onFriend={handleFriend}
        />
      )}

      <InstagramModalTemplate
        visible={instagramModal}
        onClose={() => {
          setInstagramModal(false);
        }}
        onSucceed={fetchProfile}
        state={profile.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
export default Profile;
