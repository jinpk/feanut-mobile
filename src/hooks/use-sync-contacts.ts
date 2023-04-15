import {useState} from 'react';
import {Alert, Linking, PermissionsAndroid} from 'react-native';
import Contacts, {requestPermission} from 'react-native-contacts';
import {constants} from '../libs/common';
import {useUserStore} from '../libs/stores';
import {AddFriendManyRequest} from '../libs/interfaces';
import {postFriendsMany} from '../libs/api/friendship';

export function useSyncContacts() {
  const userId = useUserStore(s => s.user?.id);
  const [loading, setLoading] = useState(false);
  const checkPermissions = async () => {
    if (constants.platform === 'android') {
      const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: '연락처 권한 요청',
          message:
            'feanut이 회원님의 연락처를 읽어와 친구목록에 추가하기 위해 권한을 허용해 주세요!',
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
      return Alert.alert('로그인후 사용할 수 있는 기능입니다.');
    }

    try {
      const granted = await checkPermissions();
      if (!granted) {
        Alert.alert(
          '연락처 읽기 실패',
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
    const params: AddFriendManyRequest = {
      contacts: [],
      invalidContacts: [],
    };

    try {
      const contacts = await Contacts.getAll();
      contacts.forEach(contact => {
        let name = '';
        // 한국 이름
        if (contact.displayName) {
          name = contact.displayName;
        } else {
          if (contact.givenName && contact.familyName) {
            name = contact.familyName + contact.givenName;
          } else if (contact.givenName) {
            name = contact.givenName;
          } else if (contact.familyName) {
            name = contact.familyName;
          }
        }

        // 한국 전화번호
        let phoneNumber = '';
        contact.phoneNumbers.forEach(({number}) => {
          if (phoneNumber) {
            return;
          }
          // only numbers
          number = number.replace(/[^0-9]/g, '');
          // 8210
          if (number.startsWith('82')) {
            number = number.replace('82', '');
          }
          if (number.startsWith('10')) {
            number = '0' + number;
          }

          // ****-****
          if (number.length === 8) {
            number = '010' + number;
          }

          if (number.length == 11) {
            phoneNumber = number;
          }
        });

        // 전화번호와 이름 모두 유효하다면
        if (phoneNumber && name) {
          params.contacts.push({name, phoneNumber});
        } else {
          params.invalidContacts.push({
            givenName: contact.givenName,
            middleName: contact.middleName,
            familyName: contact.familyName,
            displayName: contact.displayName,
            phoneNumbers: contact.phoneNumbers.map(x => x.number),
          });
        }
      });
    } catch (error: any) {
      Alert.alert('연락처 읽기 실패', error.message || error);
      setLoading(false);
      return;
    }

    const range = 50;
    try {
      // 페이징 처리
      for (let i = 0; i < params.contacts.length; i += range) {
        await postFriendsMany(userId, params);
      }
      if (cb) {
        cb();
      }
    } catch (error: any) {
      Alert.alert('연락처 동기화 실패', error.message || error);
    }

    setLoading(false);
  };

  return {
    syncContacts: handleSyncContacts,
    loading,
  };
}
