import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Alert, Keyboard, ScrollView} from 'react-native';
import {SignUpForm} from '../libs/interfaces';
import {
  SignUpGenderTemplate,
  SignUpPhoneNumberTemplate,
  SignUpNameTemplate,
  SignUpCodeTemplate,
} from '../templates/signup';
import {constants, setCredentials, yupValidators} from '../libs/common';
import {postSignUp, postSignUpVerification} from '../libs/api/auth';
import {setAPIAuthorization} from '../libs/api';
import {useUserStore} from '../libs/stores';
import {getMe} from '../libs/api/users';

const initialFormValues: SignUpForm = {
  name: '',
  phoneNumber: '',
  username: '',
  gender: 'female',
  birth: '',
  sendingCode: false,
  authId: '',
  code: '',
};

function SignUp(): JSX.Element {
  const scrollRef = useRef<ScrollView>(null);
  const navigation = useNavigation();
  const route = useRoute();
  const form = useForm<SignUpForm>({
    defaultValues: initialFormValues,
  });

  const [pageIndex, setPageIndex] = useState(0);

  const login = useUserStore(s => s.actions.login);

  useEffect(() => {
    form.setValue('username', route.params?.username);
  }, [route.params]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      x: pageIndex * constants.screenWidth,
      animated: true,
    });
  }, [pageIndex]);

  const handleGenderBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleNameBack = useCallback(() => {
    setPageIndex(0);
  }, []);

  const handlePhoneNumberBack = useCallback(() => {
    setPageIndex(1);
  }, []);

  const handleCodeBack = useCallback(() => {
    setPageIndex(2);
  }, []);

  const handleGenderConfirm = useCallback(async () => {
    const birth = form.getValues('birth');
    try {
      await yupValidators.birth.validate(birth);
      setPageIndex(1);
    } catch (error: any) {
      form.setError('birth', error);
    }
  }, []);

  const handleNameConfirm = useCallback(async () => {
    const name = form.getValues('name');
    try {
      await yupValidators.name.validate(name);
      setPageIndex(2);
    } catch (error: any) {
      form.setError('name', error);
    }
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
      const authId = await postSignUpVerification(data);
      form.setValue('authId', authId);
      setPageIndex(3);
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

    Keyboard.dismiss();

    try {
      const token = await postSignUp(data);
      setCredentials(token);
      setAPIAuthorization(token.accessToken);
      login(await getMe());
    } catch (error: any) {
      Alert.alert(error.message || error);
    }
  }, []);

  return (
    <ScrollView horizontal pagingEnabled scrollEnabled={false} ref={scrollRef}>
      <SignUpGenderTemplate
        form={form}
        onConfirm={handleGenderConfirm}
        onBack={handleGenderBack}
        focused={pageIndex === 0}
      />

      <SignUpNameTemplate
        form={form}
        focused={pageIndex === 1}
        onConfirm={handleNameConfirm}
        onBack={handleNameBack}
      />

      <SignUpPhoneNumberTemplate
        form={form}
        focused={pageIndex === 2}
        onConfirm={handlePhoneNumberConfirm}
        onBack={handlePhoneNumberBack}
      />

      <SignUpCodeTemplate
        form={form}
        focused={pageIndex === 3}
        onConfirm={handleCodeConfirm}
        onBack={handleCodeBack}
      />
    </ScrollView>
  );
}

export default SignUp;