import {useCallback} from 'react';
import {APIError, SignUpRequest} from '../libs/interfaces';
import {postSignUp} from '../libs/api/auth';
import {routes, setCredentials} from '../libs/common';
import {setAPIAuthorization} from '../libs/api';
import {useModalStore, useUserStore} from '../libs/stores';
import {getMe} from '../libs/api/users';
import {
  AUTH_ERROR_EXIST_PHONE_NUMBER,
  AUTH_ERROR_INVAILD_VERIFICATION,
} from '../libs/common/errors';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export function useSignUp() {
  const navigation = useNavigation();
  const openGuideModal = useModalStore(s => s.actions.openGuide);

  const handleSignUp = useCallback(
    async (body: SignUpRequest) => {
      try {
        const token = await postSignUp(body);
        setCredentials(token);
        setAPIAuthorization(token.accessToken);
        useUserStore.getState().actions.login(await getMe());
        openGuideModal();
      } catch (error: any) {
        const apiError = error as APIError;
        if (apiError.code === AUTH_ERROR_INVAILD_VERIFICATION) {
          Alert.alert('처리할 수 없는 인증건입니다.');
        } else if (apiError.code === AUTH_ERROR_EXIST_PHONE_NUMBER) {
          Alert.alert('이미 가입된 전화번호 입니다.', '다시 시도해 주세요.', [
            {
              text: '확인',
              isPreferred: true,
              onPress: () => {
                navigation.navigate(routes.start);
              },
            },
          ]);
        } else {
          Alert.alert(error.message || error);
        }
      }
    },
    [openGuideModal, navigation],
  );

  return handleSignUp;
}
