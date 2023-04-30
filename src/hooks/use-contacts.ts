import {useCallback, useEffect, useRef, useState, useTransition} from 'react';
import {Alert, Linking, PermissionsAndroid} from 'react-native';
import Contacts, {requestPermission} from 'react-native-contacts';
import {constants} from '../libs/common';
import {useUserStore} from '../libs/stores';
import {AddFriendManyRequest} from '../libs/interfaces';
import {postFriendsMany} from '../libs/api/friendship';

type FormattedContact = {
  name: string;
  phoneNumber: string;
};

export function useContacts() {
  const userId = useUserStore(s => s.user?.id);
  const contacts = useRef<FormattedContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [granted, setGranted] = useState(false);

  const showAlert = useCallback(() => {
    Alert.alert(
      '연락처 동기화 실패',
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
  }, []);

  const checkPermissions = async (alert?: boolean) => {
    if (constants.platform === 'android') {
      const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: '연락처 권한 요청',
          message:
            'feanut이 회원님의 연락처를 읽어와 알 수도 있는 친구를 찾아드릴게요!',
          buttonPositive: '확인',
        },
      );

      if (res !== 'granted') {
        if (alert) {
          showAlert();
        }
        setGranted(false);
      } else {
        setGranted(true);
      }
    } else {
      const res = await requestPermission();
      if (res === 'authorized') {
        setGranted(true);
      } else {
        if (alert) {
          showAlert();
        }
        setGranted(false);
      }
    }
  };

  const initContacts = async () => {
    if (!granted) return;
    if (contacts.current.length) return;
    const data: FormattedContact[] = [];
    const contactList = await Contacts.getAllWithoutPhotos();
    contactList.forEach(contact => {
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
        data.push({name, phoneNumber});
      }
    });
    contacts.current = data;
  };

  const fetchContacts = useCallback(
    async (
      page: number,
      limit: number,
    ): Promise<{total: number; list: FormattedContact[]}> => {
      console.log(contacts.current.filter(
        (x, i) => i >= (page - 1) * limit && i < page * limit,
      ))
      return {
        total: contacts.current.length,
        list: contacts.current.filter(
          (x, i) => i >= (page - 1) * limit && i < page * limit,
        ),
      };
    },
    [contacts],
  );

  return {fetchContacts, checkPermissions, granted, initContacts};
}
