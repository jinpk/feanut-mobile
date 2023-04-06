import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, Linking} from 'react-native';
import {BackTopBar} from '../components/top-bar';
import {getFriendshipStatusByProfile} from '../libs/api/friendship';
import {
  getFeanutCardByProfile,
  getPollingStatsByProfile,
} from '../libs/api/poll';
import {getProfile} from '../libs/api/profile';
import {configs} from '../libs/common/configs';
import {PROFILES_ERROR_OWNER_LESS} from '../libs/common/errors';
import {APIError, Profile} from '../libs/interfaces';
import {
  FeanutCard as FeanutCardI,
  PollingStats,
} from '../libs/interfaces/polling';
import {useProfileStore} from '../libs/stores';
import FeanutCardTemplate from '../templates/feanut-card';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

function FeanutCard() {
  const navigation = useNavigation();
  const myProfileId = useProfileStore(s => s.profile.id);
  const {
    params: {profileId, name},
  } =
    useRoute<
      RouteProp<{FeanutCard: {profileId: string; name?: string}}, 'FeanutCard'>
    >();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [friendsCount, setFriendsCount] = useState(0);
  const [pollingStats, setPollingStats] = useState<PollingStats>({
    pollsCount: 0,
    pullsCount: 0,
  });
  const [feanutCard, setFeanutCard] = useState<FeanutCardI>({
    joy: 0,
    gratitude: 0,
    serenity: 0,
    interest: 0,
    hope: 0,
    pride: 0,
    amusement: 0,
    inspiration: 0,
    awe: 0,
    love: 0,
  });

  const drawViewRef = useRef<ViewShot>(null);

  useEffect(() => {
    // 기본정보 조회
    getProfile(profileId)
      .then(profile => {
        setProfile({...profile});
      })
      .catch((error: any) => {
        Alert.alert(error.message || error);
      });

    // 친구수 조회
    getFriendshipStatusByProfile(profileId)
      .then(stats => {
        setFriendsCount(stats.friendsCount);
      })
      .catch((error: any) => {
        const apiError = error as APIError;
        if (apiError.code === PROFILES_ERROR_OWNER_LESS) {
          // 아직 가입하지 않은 프로필
        } else {
          Alert.alert(error.message || error);
        }
      });

    // 투표수 조회
    getPollingStatsByProfile(profileId)
      .then(stats => {
        setPollingStats(stats);
      })
      .catch((error: any) => {
        const apiError = error as APIError;
        if (apiError.code === PROFILES_ERROR_OWNER_LESS) {
          // 아직 가입하지 않은 프로필
        } else {
          Alert.alert(error.message || error);
        }
      });

    // 피넛카드 조회
    getFeanutCardByProfile(profileId)
      .then(card => {
        setFeanutCard(card);
      })
      .catch((error: any) => {
        const apiError = error as APIError;
        Alert.alert(error.message || error);
      });
  }, [profileId]);

  const handleShare = useCallback(() => {
    if (profileId === myProfileId) {
      if (drawViewRef.current?.capture) {
        drawViewRef.current.capture().then(uri => {
          const title = `${profile!.name}님의 피넛카드`;
          Share.open({
            title: title,
            filename: title,
            type: 'image/*',
            url: uri,
          });
        });
      }
    } else {
      if (!profile?.instagram) return;

      const instagramURL = `instagram://user?username=${profile.instagram}`;
      const instagramWebsiteURL = `https://www.instagram.com/${profile.instagram}`;
      Linking.canOpenURL(instagramURL).then(can => {
        if (can) {
          Linking.openURL(instagramURL);
        } else {
          Linking.openURL(instagramWebsiteURL);
        }
      });
    }
  }, [profileId, myProfileId, profile?.instagram, profile?.name]);

  if (!profile) {
    return <BackTopBar logo onBack={navigation.goBack} />;
  }


  return (
    <FeanutCardTemplate
      drawViewRef={drawViewRef}
      onBack={navigation.goBack}
      onShare={handleShare}
      gender={profile.gender}
      name={profile.name || name || ''}
      statusMessage={profile.statusMessage}
      instagram={profile.instagram}
      uri={
        profile.profileImageKey
          ? configs.cdnBaseUrl + '/' + profile.profileImageKey
          : ''
      }
      me={profileId === myProfileId}
      friendsCount={friendsCount}
      {...pollingStats}
      {...feanutCard}
    />
  );
}

export default FeanutCard;
