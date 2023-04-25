import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Linking} from 'react-native';
import {useCoin, useNotificationUserConfig} from '../../hooks';
import {getFriendshipStatus} from '../../libs/api/friendship';
import {getMyProfile, patchProfile} from '../../libs/api/profile';
import {routes} from '../../libs/common';
import {configs} from '../../libs/common/configs';
import {useModalStore, useProfileStore, useUserStore} from '../../libs/stores';
import ProfileTemplate from '../../templates/profile';
import {getObjectURLByKey} from '../../libs/common/file';

function Profile(): JSX.Element {
  const navigation = useNavigation();
  const userId = useUserStore(s => s.user?.id);
  const phoneNumber = useUserStore(s => s.user?.phoneNumber);
  const logout = useUserStore(s => s.actions.logout);
  const focused = useIsFocused();
  const profile = useProfileStore(s => s.profile);
  const update = useProfileStore(s => s.actions.update);

  const [friendsCount, setFriendsCount] = useState(0);

  const openWebview = useModalStore(s => s.actions.openWebview);

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
      if (__DEV__) {
        console.error(error);
      }
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
        if (__DEV__) {
          console.error(error);
        }
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

  /**
  const handleInstagram = useCallback(
    (on: boolean) => {
      if (on) {
        setInstagramModal(true);
      } else {
        Alert.alert('인스타그램 계정 연결 해지 하시겠습니까?', '', [
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
   */

  const handleService = useCallback(() => {
    Linking.openURL(configs.websiteUrl);
  }, []);

  const handlePrivacy = useCallback(() => {
    openWebview(configs.privacyUrl);
  }, []);

  const handleTerms = useCallback(() => {
    openWebview(configs.termsUrl);
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

  const handleLogout = useCallback(() => {
    Alert.alert('로그아웃 하시겠습니까?', '', [
      {text: '취소', style: 'cancel'},
      {
        text: '확인',
        onPress: () => {
          logout(true);
        },
      },
    ]);
  }, []);

  const openImageModal = useModalStore(s => s.actions.openImage);
  const handleProfileImage = useCallback(() => {
    if (profile.profileImageKey) {
      openImageModal({uri: getObjectURLByKey(profile.profileImageKey)});
    }
  }, [profile.profileImageKey]);

  const handleSetting = useCallback(() => {
    navigation.navigate(routes.setting);
  }, []);

  return (
    <ProfileTemplate
      onSetting={handleSetting}
      onBack={navigation.goBack}
      phoneNumber={phoneNumber!}
      friendsCount={friendsCount}
      onEditProfile={handleEditProfile}
      profile={profile}
      onLogout={handleLogout}
      feanutAmount={coin.amount}
      onPurchaseFeanut={coin.openPurchaseModal}
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
      onProfileImage={handleProfileImage}
    />
  );
}

export default Profile;
