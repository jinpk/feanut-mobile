import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Alert, ScrollView} from 'react-native';
import {ResetPasswordForm} from '../libs/interfaces';
import {constants, routes, yupValidators} from '../libs/common';
import {
  postResetPassword,
  postResetPasswordVerification,
  postResetPasswordVerificationCode,
} from '../libs/api/auth';
import {
  FindPasswordCodeTemplate,
  FindPasswordPhoneNumberTemplate,
  FindPasswordResetTemplate,
} from '../templates/reset-password';

const initialFormValues: ResetPasswordForm = {
  phoneNumber: '',
  username: '',
  password: '',
  passwordCheck: '',
  sendingCode: false,
  authId: '',
  code: '',
};

function ResetPassword(): JSX.Element {
  const scrollRef = useRef<ScrollView>(null);
  const navigation = useNavigation();
  const route = useRoute();
  const form = useForm<ResetPasswordForm>({
    defaultValues: initialFormValues,
  });

  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    form.setValue('username', route.params?.username);
  }, [route.params]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      x: pageIndex * constants.screenWidth,
      animated: true,
    });
  }, [pageIndex]);

  const handlePhoneNumberBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const handleCodeBack = useCallback(() => {
    setPageIndex(0);
  }, []);

  const handleResetBack = useCallback(() => {
    navigation.goBack();
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
      const authId = await postResetPasswordVerification(data);
      form.setValue('authId', authId);
      setPageIndex(1);
    } catch (error: any) {
      Alert.alert(error.message || error);
    }

    form.setValue('sendingCode', false);
  }, []);

  const handleCodeConfirm = useCallback(async () => {
    const data = form.getValues();
    if (data.code.length !== 6) {
      form.setError('code', {message: '인증번호 6자리를 입력해 주세요'});
      return;
    }

    try {
      await postResetPasswordVerificationCode(data);
      setPageIndex(2);
    } catch (error: any) {
      Alert.alert(error.message || error);
    }
  }, []);

  const handleResetConfirm = useCallback(async () => {
    const data = form.getValues();

    try {
      await yupValidators.password.validate(data.password);
    } catch (error: any) {
      form.setError('password', error);
      return;
    }

    try {
      await yupValidators.password.validate(data.passwordCheck);
    } catch (error: any) {
      form.setError('passwordCheck', error);
      return;
    }

    if (data.password !== data.passwordCheck) {
      form.setError('passwordCheck', {
        message: '비밀번호가 일치하지 않습니다',
      });
      return;
    }

    try {
      await postResetPassword(data);
      navigation.reset({index: 0, routes: [{name: routes.login}]});
    } catch (error: any) {
      Alert.alert(error.message || error);
    }
  }, []);

  return (
    <ScrollView horizontal pagingEnabled scrollEnabled={false} ref={scrollRef}>
      <FindPasswordPhoneNumberTemplate
        form={form}
        onConfirm={handlePhoneNumberConfirm}
        onBack={handlePhoneNumberBack}
        focused={pageIndex === 0}
      />

      <FindPasswordCodeTemplate
        form={form}
        onConfirm={handleCodeConfirm}
        onBack={handleCodeBack}
        focused={pageIndex === 1}
      />

      <FindPasswordResetTemplate
        form={form}
        onConfirm={handleResetConfirm}
        onBack={handleResetBack}
        focused={pageIndex === 2}
      />
    </ScrollView>
  );
}

export default ResetPassword;