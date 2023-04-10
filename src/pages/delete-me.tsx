import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {Alert} from 'react-native';
import {deleteMe} from '../libs/api/users';
import {useProfileStore, useUserStore} from '../libs/stores';
import DeleteMeTemplate from '../templates/delete-me';

function DeleteMe() {
  const navigation = useNavigation();
  const [reason, setReason] = useState('');
  const logout = useUserStore(s => s.actions.logout);
  const name = useProfileStore(s => s.profile.name);

  const handleDelete = useCallback(async () => {
    try {
      await deleteMe(reason.trim());
      logout();
    } catch (error: any) {
      Alert.alert(error.message || error);
    }
  }, [reason]);

  const handleDeleteWithAlert = useCallback(() => {
    Alert.alert(
      '정말 feanut을 탈퇴 하시겠습니까?',
      `탈퇴하면 친구들이\n${name}님을 투표할 수 없어요`,
      [
        {text: '탈퇴', onPress: handleDelete},
        {text: '취소', style: 'cancel'},
      ],
    );
  }, [handleDelete, name]);

  return (
    <DeleteMeTemplate
      name={name}
      reason={reason}
      onReasonChange={setReason}
      onBack={navigation.goBack}
      onDelete={handleDeleteWithAlert}
    />
  );
}

export default DeleteMe;
