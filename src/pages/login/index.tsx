import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {Alert, StatusBar, StyleSheet, View} from 'react-native';
import {LoginForm} from '../../libs/interfaces';
import {colors, setCredentials, yupValidators} from '../../libs/common';
import LoginTemplate from '../../templates/login';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {getExistenceUserByUsername, getMe} from '../../libs/api/users';
import {postLogin} from '../../libs/api/auth';
import {setAPIAuthorization} from '../../libs/api';
import {useUserStore} from '../../libs/stores';

const initialFormValues: LoginForm = {
  username: '',
  password: '',
  hasUsername: false,
};

const schema = yup
  .object()
  .shape({
    username: yupValidators.username,
  })
  .required();

function Login(): JSX.Element {
  const [signUpModal, setSignUpModal] = useState(false);
  const login = useUserStore(s => s.actions.login);

  const loginForm = useForm<LoginForm>({
    resolver: yupResolver(schema),
    defaultValues: initialFormValues,
  });

  const handleLogin = async (data: LoginForm) => {
    try {
      await yupValidators.password.validate(data.password);
    } catch (error: any) {
      loginForm.setError('password', {message: error.message});
      return;
    }

    try {
      const token = await postLogin({
        username: data.username,
        password: data.password,
      });

      setCredentials(token);
      setAPIAuthorization(token.accessToken);
      login(await getMe());
    } catch (error: any) {
      Alert.alert('로그인 실패', error.message || error);
    }
  };

  const onSubmit = async (data: LoginForm) => {
    try {
      if (!data.hasUsername) {
        const exist = await getExistenceUserByUsername(data.username);
        if (exist) {
          // 로그인모드
          loginForm.setValue('hasUsername', true);
          loginForm.setValue('password', '');
        } else {
          // 회원가입유도
          setSignUpModal(true);
        }
      } else {
        handleLogin(data);
      }
    } catch (error: any) {
      Alert.alert(error.message || error);
    }
  };

  const handleFirst = async () => {
    const username = loginForm.watch().username;
    if (!username) {
      Alert.alert(
        'feanut이 처음이신가요?',
        '사용할 feanut ID를 입력후 다시 버튼을 눌러주세요!',
      );
    }

    try {
      await yupValidators.username.validate(username);
      setSignUpModal(true);
    } catch (error: any) {
      Alert.alert('feanut ID 입력 오류', error.messasge);
    }
  };

  const handleFindPassword = () => {};

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.topPadding} />
      <LoginTemplate
        form={loginForm}
        onSubmit={loginForm.handleSubmit(onSubmit)}
        onFirst={handleFirst}
        onFindPassword={handleFindPassword}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.white},
  topPadding: {
    paddingTop: 70,
  },
});

export default Login;
