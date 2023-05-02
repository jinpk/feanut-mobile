import React, {useCallback} from 'react';
import {useModalStore, useUserStore} from '../libs/stores';
import {LegacyFriendshipModalTemplate} from '../templates/modal/legacy-friendship';
import {postClearFriendsForLegacy} from '../libs/api/friendship';
import {Alert} from 'react-native';
import {useMessageModalStore} from '../libs/stores/message-modal';
import {routes} from '../libs/common';
import {useNavigation} from '@react-navigation/native';

export const LegacyFriendshipModal = (): JSX.Element => {
  const close = useModalStore(s => s.actions.closeLegacyFriendship);
  const visible = useModalStore(s => s.legacyFriendship);
  const userId = useUserStore(s => s.user?.id);
  const openMessageModal = useMessageModalStore(s => s.actions.open);
  const navigation = useNavigation();

  const handleClear = useCallback(() => {
    if (userId) {
      postClearFriendsForLegacy(userId)
        .then(() => {
          close();
          openMessageModal(
            '친구 목록 초기화 완료\n\n휴대폰 연락처에 있는 사람들을\n다시 친구로 추가할 수 있어요!',
            [
              {text: '다음에'},
              {
                text: '추가하기',
                onPress: () => {
                  navigation.navigate(routes.friend, {add: true});
                },
              },
            ],
          );
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
