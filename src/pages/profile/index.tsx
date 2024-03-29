import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {useCoin} from '../../hooks';
import {
  getFriendByProfileId,
  getFriendshipStatusByProfile,
} from '../../libs/api/friendship';
import {getMyProfile, getProfile} from '../../libs/api/profile';
import {colors, routes} from '../../libs/common';
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
import {StyleSheet} from 'react-native';
import {getMyReferralLink} from '../../libs/services/firebase-links';
import Share from 'react-native-share';

type ProfileRoute = RouteProp<
  {Profile: {profileId: string; contactName?: string}},
  'Profile'
>;

function Profile(): JSX.Element {
  const {params} = useRoute<ProfileRoute>();
  const myProfile = useProfileStore(s => s.profile);
  const userId = useUserStore(s => s.user?.id);
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

  const coin = useCoin();

  const [contactName, setContactName] = useState('');

  useEffect(() => {
    if (params?.contactName) {
      setContactName(params.contactName);
    }
  }, [params?.contactName]);

  // 다른사람 프로필 조회 시 내 연락처의 친구 이름
  useEffect(() => {
    if (userId && params?.profileId && myProfile.id !== params.profileId) {
      getFriendByProfileId(userId, params.profileId).then(friendship => {
        setContactName(friendship.name);
      });
    }
  }, [userId, params?.profileId, myProfile.id]);

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
    if (!profile?.id || !focused) return;
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

    getFeanutCardByProfile(profile.id)
      .then(setFeanutCard)
      .catch((error: any) => {
        const apiError = error as APIError;
        if (__DEV__) {
          console.error(apiError);
        }
      });
  }, [profile?.id, focused]);

  const openImageModal = useModalStore(s => s.actions.openImage);
  const handleProfileImage = useCallback(() => {
    if (profile?.profileImageKey) {
      openImageModal({uri: getObjectURLByKey(profile.profileImageKey)});
    }
  }, [profile?.profileImageKey]);

  const handleSetting = useCallback(() => {
    navigation.navigate(routes.setting);
  }, []);

  const handleFriend = useCallback(() => {
    navigation.navigate(routes.friend, {list: true});
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
      isMyProfile
        ? '피넛 카드란?\n\n피넛 카드는 투표 카테고리 총 10가지 중 득표한 수 순서대로 보여지게 됩니다.\n친구 프로필에서 친구의 피넛카드도\n확인해 보세요!'
        : '피넛 카드란?\n\n피넛 카드는 투표 카테고리 총 10가지 중 득표한 수 순서대로 보여지게 됩니다.',

      [{text: '확인', color: colors.blue}],
    );
  }, [isMyProfile]);

  const handleEditProfile = useCallback(() => {
    navigation.navigate(routes.profileEdit);
  }, []);

  const invitingRef = useRef(false);
  const handleInvite = useCallback(() => {
    if (invitingRef.current) return;
    invitingRef.current = true;
    getMyReferralLink(userId!).then(url => {
      Share.open({
        url,
      })
        .then(() => {
          return;
        })
        .catch(error => {
          return;
        })
        .finally(() => {
          invitingRef.current = false;
        });
    });
  }, []);

  if (!profile)
    return (
      <View style={styles.root}>
        <BackTopBar title="프로필" onBack={navigation.goBack} />
      </View>
    );

  return (
    <ProfileTemplate
      coinAmount={coin.amount}
      onSetting={handleSetting}
      onBack={navigation.goBack}
      onFriend={handleFriend}
      phoneNumber={phoneNumber!}
      profile={profile}
      contactName={contactName}
      onPurchaseFeanut={coin.openPurchaseModal}
      onProfileImage={handleProfileImage}
      onInvite={handleInvite}
      me={isMyProfile}
      onFeautCardTooltip={handleFeanutCardTooltip}
      friendsCount={friendsCount}
      feanutCard={feanutCard}
      onEditProfile={handleEditProfile}
      onFeautCard={handleFeanutCard}
      {...pollingStats}
    />
  );
}

const styles = StyleSheet.create({
  root: {backgroundColor: colors.white, flex: 1},
});
export default Profile;
