import React, {useCallback} from 'react';
import {useModalStore, useUserStore} from '../libs/stores';
import {LegacyFriendshipModalTemplate} from '../templates/modal/legacy-friendship';
import {postClearFriendsForLegacy} from '../libs/api/friendship';
import {Alert} from 'react-native';

export const LegacyFriendshipModal = (): JSX.Element => {
  const close = useModalStore(s => s.actions.closeLegacyFriendship);
  const visible = useModalStore(s => s.legacyFriendship);
  const userId = useUserStore(s => s.user?.id);

  const handleClear = useCallback(() => {
    if (userId) {
      postClearFriendsForLegacy(userId)
        .then(() => {
          close();
        })
        .catch(error => {
          Alert.alert(error.message || error);
        });
    }
  }, [userId]);

  return (
    <LegacyFriendshipModalTemplate visible={visible} onClear={handleClear} />
  );
};
