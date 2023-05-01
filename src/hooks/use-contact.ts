import {getAllWithoutPhotos, requestPermission} from 'react-native-contacts';
import {constants} from '../libs/common';
import {PermissionsAndroid} from 'react-native';
import {useCallback, useRef, useState} from 'react';
import {getUserRecommendation} from '../libs/api/users';
import {UserRecommendation} from '../libs/interfaces';

export type ParsedContact = {
  name: string;
  phoneNumber: string;
  data?: UserRecommendation;
};

export default function useContact() {
  const contacts = useRef<UserRecommendation[]>([]);

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

  const storeContacts = async () => {
    if (!(await checkPermissions())) {
      return;
    }

    setLoading(true);
    contacts.current = [];

    const validList: ParsedContact[] = [];

    const list = await getAllWithoutPhotos();

    list.forEach(contact => {
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
        validList.push({name, phoneNumber});
      }
    });

    const filtered: UserRecommendation[] = [];
    for (let i = 0; i < validList.length; i += 50) {
      const sliced = validList.slice(i, i + 50);
      const res = await getUserRecommendation({
        page: 1, // ignored
        limit: 1, // ignored
        phoneNumber: sliced.map(x => x.phoneNumber).join(','),
      });
      filtered.push(
        ...sliced
          .map((x, _i) => {
            const exist = res.data.find(z => z.phoneNumber === x.phoneNumber);
            if (!exist) {
              return {...x};
            } else {
              if (exist.isFriend) {
                return null;
              } else {
                return {
                  ...exist,
                  ...x,
                };
              }
            }
          })
          .filter(x => x),
      );
    }
    contacts.current = filtered;
    setLoading(false);
  };

  const fetch = async (page: number, limit: number) => {
    let start = (page - 1) * limit;
    let sliced = contacts.current.slice(start, start + limit);
    return {
      data: sliced,
      total: contacts.current.length,
    };
  };

  const handleRemoveItem = useCallback((phoneNumber: string) => {
    contacts.current = contacts.current.filter(
      x => x.phoneNumber !== phoneNumber,
    );
  }, []);

  return {
    loading,
    checkPermissions,
    fetch: fetch,
    storeContacts,
    removeItem: handleRemoveItem,
  };
}