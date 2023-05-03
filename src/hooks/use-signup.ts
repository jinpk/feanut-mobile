import {useCallback} from 'react';
import {APIError, SignUpRequest} from '../libs/interfaces';
import {postSignUp} from '../libs/api/auth';
import {routes, setCredentials} from '../libs/common';
import {setAPIAuthorization} from '../libs/api';
import {useModalStore} from '../libs/stores';
import {
  AUTH_ERROR_EXIST_PHONE_NUMBER,
  AUTH_ERROR_INVAILD_VERIFICATION,
} from '../libs/common/errors';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDynamicLinkStore} from '../libs/stores/dynamic-link';
import {configs} from '../libs/common/configs';

export function useSignUp() {
  const navigation = useNavigation();
  const openGuideModal = useModalStore(s => s.actions.openGuide);
  const dynamicLink = useDynamicLinkStore(s => s.link);
  const clearDynamicLink = useDynamicLinkStore(s => s.actions.clear);

  const handleSignUp = useCallback(
    async (body: SignUpRequest) => {
      try {
        /** 회원가입 리퍼럴 코드 & 링크로 앱 열었을 경우만 */
        if (dynamicLink && dynamicLink.startsWith(configs.referralLinkUrl)) {
          const query = dynamicLink
            .replace(configs.referralLinkUrl + '?', '')
            .split('&')
            .reduce((p, c) => {
              const [key, value] = c.split('=');
              return {...p, [key]: value};
            }, {}) as any;
          const referralUserId = query[configs.referralLinkUserIdKey];
          if (referralUserId) {
            body.referralUserId = referralUserId;
          }
        }

        const token = await postSignUp(body);
        setCredentials(token);
        setAPIAuthorization(token.accessToken);
        // 초기 친구추가 화면 이동
        navigation.reset({
          index: 1,
          routes: [{name: routes.start}, {name: routes.signupFriend}],
        });
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
      if (dynamicLink) {
        clearDynamicLink();
      }
    },
    [openGuideModal, navigation, dynamicLink],
  );

  return handleSignUp;
}
