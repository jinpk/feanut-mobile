import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {Linking} from 'react-native';
import {useCoin} from '../../hooks';
import {getFriendshipStatusByProfile} from '../../libs/api/friendship';
import {getMyProfile, getProfile} from '../../libs/api/profile';
import {colors, routes} from '../../libs/common';
import {configs} from '../../libs/common/configs';
import {useModalStore, useProfileStore, useUserStore} from '../../libs/stores';
import ProfileTemplate from '../../templates/profile';
import {getObjectURLByKey} from '../../libs/common/file';
import {APIError, Profile as ProfileI} from '../../libs/interfaces';
import {BackTopBar} from '../../components/top-bar';
import {
  getFeanutCardByProfile,
  getPollingStatsByProfile,
} from '../../libs/api/poll';
import {FeanutCard, PollingStats} from '../../libs/interfaces/polling';
import {useMessageModalStore} from '../../libs/stores/message-modal';

type ProfileRoute = RouteProp<{Profile: {profileId: string}}, 'Profile'>;

function Profile(): JSX.Element {
  const {params} = useRoute<ProfileRoute>();
  const myProfile = useProfileStore(s => s.profile);
  const [profile, setProfile] = useState<ProfileI>();

  const isMyProfile = profile?.id === myProfile.id;

  const navigation = useNavigation();
  const phoneNumber = useUserStore(s => s.user?.phoneNumber);
  const focused = useIsFocused();
  const updateMyProfile = useProfileStore(s => s.actions.update);

  const [friendsCount, setFriendsCount] = useState(0);
  const [pollingStats, setPollingStats] = useState<PollingStats>({
    pollsCount: 0,
    pullsCount: 0,
  });

  const [feanutCard, setFeanutCard] = useState<FeanutCard>();

  const openWebview = useModalStore(s => s.actions.openWebview);

  const coin = useCoin();

  // 프로필 조회
  useEffect(() => {
    if (!focused) {
      return;
    }
    const fetchProfile = async () => {
      try {
        if (params?.profileId) {
          const profile = await getProfile(params.profileId);
          setProfile(profile);
        } else {
          const profile = await getMyProfile();
          setProfile(profile);
          updateMyProfile(profile);
        }
      } catch (error: any) {
        if (__DEV__) {
          console.error(error);
        }
      }
    };

    fetchProfile();
  }, [focused, params?.profileId]);

  // stats 조회
  useEffect(() => {
    if (!profile?.id) return;
    // 친구수 조회
    getFriendshipStatusByProfile(profile.id)
      .then(stats => {
        setFriendsCount(stats.friendsCount);
      })
      .catch((error: any) => {
        const apiError = error as APIError;
        if (__DEV__) {
          console.error(apiError);
        }
      });

    // 투표수 조회
    getPollingStatsByProfile(profile.id)
      .then(stats => {
        setPollingStats(stats);
      })
      .catch((error: any) => {
        const apiError = error as APIError;
        if (__DEV__) {
          console.error(apiError);
        }
      });
  }, [profile?.id]);

  // stats 조회
  useEffect(() => {
    if (!profile?.id) return;
    // 피넛카드 조회
    getFeanutCardByProfile(profile.id)
      .then(setFeanutCard)
      .catch((error: any) => {
        const apiError = error as APIError;
        if (__DEV__) {
          console.error(apiError);
        }
      });
  }, [profile?.id]);

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
    if (profile?.id) {
      navigation.navigate(routes.feanutCard, {profileId: profile.id});
    }
  }, [profile?.id]);

  const openImageModal = useModalStore(s => s.actions.openImage);
  const handleProfileImage = useCallback(() => {
    if (isMyProfile) {
      navigation.navigate(routes.profileEdit);
    } else {
      if (profile?.profileImageKey) {
        openImageModal({uri: getObjectURLByKey(profile.profileImageKey)});
      }
    }
  }, [profile?.profileImageKey, isMyProfile]);

  const handleSetting = useCallback(() => {
    navigation.navigate(routes.setting);
  }, []);

  const handleFriend = useCallback(() => {
    navigation.navigate(routes.friend);
  }, []);

  const handleFeanutCard = useCallback(() => {
    if (profile?.id) {
      navigation.navigate(routes.feanutCard, {
        profileId: profile.id,
        name: profile.name,
      });
    }
  }, [profile?.id]);

  const openMessageModal = useMessageModalStore(s => s.actions.open);
  const handleFeanutCardTooltip = useCallback(() => {
    openMessageModal(
      '피넛 카드란?\n\n피넛 카드는 투표 카테고리 총 10가지 중 득표한 수 순서대로 보여지게 됩니다.\n친구 프로필에서 친구의 피넛카드도\n확인해 보세요!',
      [{text: '확인', color: colors.blue}],
    );
  }, []);

  if (!profile) return <BackTopBar title="프로필" onBack={navigation.goBack} />;

  return (
    <ProfileTemplate
      coinAmount={coin.amount}
      onSetting={handleSetting}
      onBack={navigation.goBack}
      onFriend={handleFriend}
      phoneNumber={phoneNumber!}
      profile={profile}
      onPurchaseFeanut={coin.openPurchaseModal}
      onPrivacy={handlePrivacy}
      onTerms={handleTerms}
      onService={handleService}
      onWithdrawal={handleWithdrawal}
      onCard={handleCard}
      onProfileImage={handleProfileImage}
      me={isMyProfile}
      onFeautCardTooltip={handleFeanutCardTooltip}
      friendsCount={friendsCount}
      feanutCard={feanutCard}
      onFeautCard={handleFeanutCard}
      {...pollingStats}
    />
  );
}

export default Profile;
