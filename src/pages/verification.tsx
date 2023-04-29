import {
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  APIError,
  AuthResponse,
  PhoneNumberForm,
  SignInVerificationRequest,
  VerificationParams,
} from '../libs/interfaces';
import {
  colors,
  constants,
  routes,
  setCredentials,
  yupValidators,
} from '../libs/common';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PhoneNumberTemplate from '../templates/phone-number';
import PhoneNumberCodeTemplate from '../templates/phone-number/code';
import {
  postSignIn,
  postSignInVerification,
  postSignUp,
  postSignUpVerification,
  postSignUpVerificationConfirmation,
} from '../libs/api/auth';
import {
  AUTH_ERROR_COOL_TIME,
  AUTH_ERROR_EXIST_PHONE_NUMBER,
  AUTH_ERROR_INVAILD_VERIFICATION,
  AUTH_ERROR_INVALID_CODE,
  AUTH_ERROR_NOT_FOUND_PHONE_NUMBER,
  AUTH_ERROR_VERIFICATION_TIMEOUT,
} from '../libs/common/errors';
import {setAPIAuthorization} from '../libs/api';
import {useModalStore, useUserStore} from '../libs/stores';
import {getMe} from '../libs/api/users';
import {useHandleBack} from '../hooks';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const initialFormValues: PhoneNumberForm = {
  phoneNumber: '',
  sendingCode: false,
  authId: '',
  code: '',
};

function Verification(): JSX.Element {
  const {params} =
    useRoute<RouteProp<{Verification: VerificationParams}, 'Verification'>>();

  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const form = useForm<PhoneNumberForm>({
    defaultValues: initialFormValues,
  });

  const [pageIndex, setPageIndex] = useState(0);
  const pageIndexRef = useRef(0);
  useEffect(() => {
    pageIndexRef.current = pageIndex;
  }, [pageIndex]);
  const handleBack = useCallback(() => {
    switch (pageIndexRef.current) {
      case 0:
        navigation.goBack();
        break;
      default:
        setPageIndex(pageIndexRef.current - 1);
        break;
    }
  }, []);
  useHandleBack(handleBack);

  const openGuideModal = useModalStore(s => s.actions.openGuide);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      x: pageIndex * constants.screenWidth,
      animated: constants.platform === 'ios',
    });
  }, [pageIndex]);

  const handlePhoneNumberBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const handleCodeBack = useCallback(() => {
    setPageIndex(0);
  }, []);

  const handlePhoneNumberConfirm = useCallback(async () => {
    const data = form.getValues();

    if (data.sendingCode) {
      return;
    }

    try {
      await yupValidators.phoneNumber.validate(data.phoneNumber);
    } catch (error: any) {
      form.setError('phoneNumber', error);
      return;
    }

    form.setValue('sendingCode', true);

    try {
      let response: AuthResponse = {authId: ''};

      /** 회원가입 인증코드 */
      if (params.type === 'signup') {
        response = await postSignUpVerification({
          phoneNumber: data.phoneNumber,
        });
      } else if (params.type === 'signin') {
        const body: SignInVerificationRequest = {
          phoneNumber: data.phoneNumber,
        };
        response = await postSignInVerification(body);
      }

      form.setValue('authId', response.authId);
      form.setValue('code', '');
      setPageIndex(1);
    } catch (error: any) {
      const apiError = error as APIError;
      if (apiError.code === AUTH_ERROR_COOL_TIME) {
        form.setError('phoneNumber', {
          message: '잠시 후에 다시 시도해 주세요.',
        });
      } else if (apiError.code === AUTH_ERROR_EXIST_PHONE_NUMBER) {
        form.setError('phoneNumber', {
          message: '이미 가입된 전화번호 입니다.',
        });
      } else if (apiError.code === AUTH_ERROR_NOT_FOUND_PHONE_NUMBER) {
        form.setError('phoneNumber', {
          message: '가입되지 않은 전화번호 입니다.',
        });
      } else {
        Alert.alert('인증번호 전송 오류', error.message || error);
      }
    }

    form.setValue('sendingCode', false);
  }, [params]);

  const handleCodeConfirm = useCallback(async () => {
    const data = form.getValues();
    if (data.code.length !== 6) {
      form.setError('code', {message: '인증번호 6자리를 입력해 주세요'});
      return;
    }

    Keyboard.dismiss();

    try {
      /** 회원가입 및 자동 로그인 */
      if (params.type === 'signup') {
        // 회원가입 인증 확인
        await postSignUpVerificationConfirmation(data);
        // 회원가입 정보 입력 화면으로 이동
        navigation.replace(routes.signup, {authId: data.authId});
      } else if (params.type === 'signin') {
        const token = await postSignIn(data);
        setCredentials(token);
        setAPIAuthorization(token.accessToken);
        /** 로그인 완료시 자동 화면 이동됨. app.tsx */
        useUserStore.getState().actions.login(await getMe());
      }
    } catch (error: any) {
      const apiError = error as APIError;
      if (apiError.code === AUTH_ERROR_INVAILD_VERIFICATION) {
        form.setError('code', {
          message: '처리할 수 없는 인증건입니다.',
        });
      } else if (apiError.code === AUTH_ERROR_VERIFICATION_TIMEOUT) {
        form.setError('code', {
          message: '인증 가능한 시간이 지났습니다. 다시 시도해 주세요.',
        });
      } else if (apiError.code === AUTH_ERROR_INVALID_CODE) {
        form.setError('code', {
          message: '인증번호를 다시 확인해 주세요',
        });
      } else {
        Alert.alert(error.message || error);
      }
    }
  }, [params]);

  const title = useMemo(() => {
    if (params.type === 'signin') {
      return '가입시 입력했던 전화번호를 입력해 주세요';
    }

    return '전화번호를 입력해 주세요';
  }, []);

  const message = useMemo(() => {
    if (params.type === 'signin') {
      return '';
    }
    return '';
    // return '친구가 이미 회원님을 투표했을 수도 있어요';
  }, [params.type]);

  return (
    <KeyboardAvoidingView
      style={styles.scrollview}
      {...(constants.platform === 'ios' ? {behavior: 'padding'} : {})}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        horizontal
        pagingEnabled
        scrollEnabled={false}
        style={styles.scrollview}
        ref={scrollRef}
        showsHorizontalScrollIndicator={false}
        removeClippedSubviews>
        <View style={[styles.screen, {paddingBottom: insets.bottom}]}>
          <PhoneNumberTemplate
            form={form}
            onConfirm={handlePhoneNumberConfirm}
            onBack={handlePhoneNumberBack}
            focused={pageIndex === 0}
            title={title}
            message={message}
          />
        </View>

        <View style={[styles.screen, {paddingBottom: insets.bottom}]}>
          <PhoneNumberCodeTemplate
            form={form}
            onConfirm={handleCodeConfirm}
            onBack={handleCodeBack}
            focused={pageIndex === 1}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollview: {
    flex: 1,
    backgroundColor: '#fff',
  },
  screen: {width: constants.screenWidth, backgroundColor: colors.white},
});

export default Verification;
