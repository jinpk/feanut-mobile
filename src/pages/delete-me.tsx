import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {Alert} from 'react-native';
import {deleteMe} from '../libs/api/users';
import {useUserStore} from '../libs/stores';
import DeleteMeTemplate from '../templates/delete-me';

function DeleteMe() {
  const navigation = useNavigation();
  const [reason, setReason] = useState('');
  const logout = useUserStore(s => s.actions.logout);

  const handleDelete = useCallback(async () => {
    try {
      await deleteMe(reason);
      logout();
    } catch (error: any) {
      Alert.alert(error.message || error);
    }
  }, [reason]);

  return (
    <DeleteMeTemplate
      reason={reason}
      onReasonChange={setReason}
      onBack={navigation.goBack}
      onDelete={handleDelete}
    />
  );
}

export default DeleteMe;
