import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Alert, Linking} from 'react-native';
import {BackTopBar} from '../components/top-bar';
import {
  getFriendByProfileId,
  getFriendshipStatusByProfile,
} from '../libs/api/friendship';
import {
  getFeanutCardByProfile,
  getPollingStatsByProfile,
} from '../libs/api/poll';
import {getProfile} from '../libs/api/profile';
import {PROFILES_ERROR_OWNER_LESS} from '../libs/common/errors';
import {APIError, Profile} from '../libs/interfaces';
import {
  FeanutCard as FeanutCardI,
  PollingStats,
} from '../libs/interfaces/polling';
import {useProfileStore, useUserStore} from '../libs/stores';
import FeanutCardTemplate from '../templates/feanut-card';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import {View} from 'react-native';
import {colors} from '../libs/common';
import {getObjectURLByKey} from '../libs/common/file';

function FeanutCard() {
  const navigation = useNavigation();
  const myProfileId = useProfileStore(s => s.profile.id);
  const myUserId = useUserStore(s => s.user?.id);
  const {
    params: {profileId},
  } = useRoute<RouteProp<{FeanutCard: {profileId: string}}, 'FeanutCard'>>();

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

  const [friendshipName, setFriendshipName] = useState('');

  useEffect(() => {
    // 친구관계 조회
    if (myUserId && profileId !== myProfileId) {
      getFriendByProfileId(myUserId, profileId)
        .then(friend => {
          if (friend) {
            setFriendshipName(friend.name);
          }
        })
        .catch((error: any) => {
          if (__DEV__) {
            console.error(error);
          }
        });
    }

    // 기본정보 조회
    getProfile(profileId)
      .then(profile => {
        setProfile({...profile});
      })
      .catch((error: any) => {
        if (__DEV__) {
          console.error(error);
        }
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
          if (__DEV__) {
            console.error(apiError);
          }
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
          if (__DEV__) {
            console.error(apiError);
          }
        }
      });

    // 피넛카드 조회
    getFeanutCardByProfile(profileId)
      .then(card => {
        setFeanutCard(card);
      })
      .catch((error: any) => {
        const apiError = error as APIError;
        if (__DEV__) {
          console.error(apiError);
        }
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
      if (!profile?.instagram) {
        Alert.alert('친구가 아직 인스타그램 계정을 연결하지 않았어요.');
      } else {
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
    }
  }, [profileId, myProfileId, profile?.instagram, profile?.name]);

  const finalName = useMemo(() => {
    if (profile?.ownerId) {
      // 가입 이름
      return profile?.name;
    } else {
      // 내 연락처 설정 이름
      if (friendshipName) {
        return friendshipName;
      }
      // 서비스 default 이름
      return profile?.name;
    }
  }, [friendshipName, profile?.name, profile?.ownerId]);

  if (!profile) {
    return (
      <View style={{flex: 1, backgroundColor: colors.white}}>
        <BackTopBar logo onBack={navigation.goBack} />
      </View>
    );
  }

  return (
    <FeanutCardTemplate
      drawViewRef={drawViewRef}
      onBack={navigation.goBack}
      onShare={handleShare}
      gender={profile.gender}
      name={finalName}
      statusMessage={profile.statusMessage}
      instagram={profile.instagram}
      uri={getObjectURLByKey(profile.profileImageKey, '150')}
      me={profileId === myProfileId}
      friendsCount={friendsCount}
      {...pollingStats}
      {...feanutCard}
    />
  );
}

export default FeanutCard;
