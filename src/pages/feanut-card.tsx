import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {getFeanutCardByProfile} from '../libs/api/poll';
import {APIError} from '../libs/interfaces';
import {FeanutCard as FeanutCardI} from '../libs/interfaces/polling';
import FeanutCardTemplate from '../templates/feanut-card';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

type FeanutCardRoute = RouteProp<
  {FeanutCard: {profileId: string; name: string}},
  'FeanutCard'
>;
function FeanutCard() {
  const navigation = useNavigation();
  const {
    params: {profileId, name},
  } = useRoute<FeanutCardRoute>();

  const [feanutCard, setFeanutCard] = useState<FeanutCardI>();

  const drawViewRef = useRef<ViewShot>(null);

  useEffect(() => {
    // 피넛카드 조회
    getFeanutCardByProfile(profileId)
      .then(setFeanutCard)
      .catch((error: any) => {
        const apiError = error as APIError;
        if (__DEV__) {
          console.error(apiError);
        }
      });
  }, [profileId]);

  const handleShare = useCallback(() => {
    if (drawViewRef.current?.capture) {
      drawViewRef.current.capture().then(uri => {
        const title = `피넛 카드`;
        Share.open({
          title: title,
          filename: title,
          type: 'image/*',
          url: uri,
        });
      });
    }
  }, [profileId]);

  return (
    <FeanutCardTemplate
      name={name}
      drawViewRef={drawViewRef}
      onBack={navigation.goBack}
      onShare={handleShare}
      feanutCard={feanutCard}
    />
  );
}

export default FeanutCard;
