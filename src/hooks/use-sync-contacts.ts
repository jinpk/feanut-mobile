import {useState} from 'react';
import {Alert, Linking, PermissionsAndroid} from 'react-native';
import Contacts, {requestPermission} from 'react-native-contacts';
import {postFriend} from '../libs/api/friendship';
import {constants} from '../libs/common';
import {useUserStore} from '../libs/stores';

export function useSyncContacts() {
  const userId = useUserStore(s => s.user?.id);
  const [loading, setLoading] = useState(false);
  const checkPermissions = async () => {
    if (constants.platform === 'android') {
      const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: '연락처 읽기 권한 허용',
          message:
            'feanut이 회원님의 연락처에 있는 친구 목록을 읽어오기 위해 권한을 허용해 주세요!',
          buttonPositive: '확인',
        },
      );

      if (res !== 'granted') {
        return false;
      } else {
        return true;
      }
    } else {
      const res = await requestPermission();
      if (res === 'authorized') {
        return true;
      } else {
        return false;
      }
    }
  };

  const handleSyncContacts = async (cb?: () => void) => {
    if (loading) {
      return;
    } else if (!userId) {
      return Alert.alert('로그인후 진행해 주세요');
    }

    try {
      const granted = await checkPermissions();
      if (!granted) {
        Alert.alert(
          '연락처를 읽어올 수 없습니다',
          '설정에서 feanut 연락처 접근 허용후 다시 시도해 주세요.',
          [
            {
              text: '설정',
              isPreferred: true,
              onPress: () => {
                Linking.openSettings();
              },
            },
            {text: '다음에', style: 'cancel'},
          ],
        );
        return;
      }
    } catch (error: any) {
      Alert.alert('연락처 권한 오류', error.message || error);
      return;
    }

    setLoading(true);
    try {
      if (loading) {
        throw new Error(
          '회원님의 연락처에있는 친구 목록을 불러오고 있어요. 잠시만 기다려주세요.',
        );
      }

      const contacts = await Contacts.getAll();

      let succeedCount = 0;
      let failedCount = 0;
      for (const contact of contacts) {
        let name = '';
        if (contact.displayName) {
          name = contact.displayName;
        } else {
          if (contact.givenName && contact.familyName) {
            // 한국이름
            name = contact.familyName + contact.givenName;
          } else if (contact.givenName) {
            name = contact.givenName;
          } else if (contact.familyName) {
            name = contact.familyName;
          }
        }

        let phoneNumber = '';
        contact.phoneNumbers.forEach(({number}) => {
          if (phoneNumber) {
            return;
          }
          number = number.replace(/[^0-9]/g, '');
          if (number.startsWith('82')) {
            number = number.replace('82', '');
          }

          if (number.startsWith('10')) {
            number = '0' + number;
          }

          if (number.length === 8) {
            number = '010' + number;
          }

          if (number.length == 11) {
            phoneNumber = number;
          }
        });

        if (name && phoneNumber) {
          try {
            await postFriend(userId, {name, phoneNumber});
            succeedCount++;
          } catch (error: any) {
            failedCount++;
          }
        } else {
          failedCount++;
        }
      }

      if (__DEV__) {
        console.log(
          '친구 동기화 성공: ',
          succeedCount,
          ', 실패: ',
          failedCount,
        );
      }
    } catch (error: any) {
      Alert.alert('연락처 동기화 오류', error.message || error);
    }

    if (cb) {
      cb();
    }
    setLoading(false);
  };

  return {
    syncContacts: handleSyncContacts,
    loading,
  };
}
