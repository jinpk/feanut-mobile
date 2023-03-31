import * as yup from 'yup';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {Alert, Linking} from 'react-native';
import {LoginForm} from '../libs/interfaces';
import {routes, setCredentials, yupValidators} from '../libs/common';
import LoginTemplate from '../templates/login';
import {yupResolver} from '@hookform/resolvers/yup';
import {getExistenceUserByUsername, getMe} from '../libs/api/users';
import {postLogin} from '../libs/api/auth';
import {setAPIAuthorization} from '../libs/api';
import {useUserStore} from '../libs/stores';
import {SignUpModal} from '../components/signup-modal';
import {useNavigation} from '@react-navigation/native';
import {configs} from '../libs/common/configs';

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
  const navigation = useNavigation();
  const [signUpModal, setSignUpModal] = useState(false);
  const login = useUserStore(s => s.actions.login);

  const loginForm = useForm<LoginForm>({
    resolver: yupResolver(schema),
    defaultValues: initialFormValues,
  });

  const username = loginForm.watch().username;

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
    if (!username) {
      Alert.alert(
        'feanut이 처음이신가요?',
        '사용할 feanut ID를 입력후 다시 버튼을 눌러주세요!',
      );
      return;
    }

    try {
      await yupValidators.username.validate(username);
      const exist = await getExistenceUserByUsername(username);
      if (exist) {
        loginForm.setError('username', {
          message: '이미 사용중인 아이디입니다.',
        });
      } else {
        setSignUpModal(true);
      }
    } catch (error: any) {
      Alert.alert('feanut ID 입력 오류', error.messasge);
    }
  };

  const handleFindPassword = () => {
    navigation.navigate(routes.resetPassword, {
      username,
    });
  };

  const handleSignUp = () => {
    setSignUpModal(false);
    navigation.navigate(routes.signup, {
      username,
    });
  };

  return (
    <>
      <LoginTemplate
        form={loginForm}
        onSubmit={loginForm.handleSubmit(onSubmit)}
        onFirst={handleFirst}
        onFindPassword={handleFindPassword}
      />
      <SignUpModal
        username={loginForm.watch().username}
        visible={signUpModal}
        onPrivacyTerm={() => {
          Linking.openURL(configs.privacyUrl);
        }}
        onServiceTerm={() => {
          Linking.openURL(configs.termsUrl);
        }}
        onSignUp={handleSignUp}
        onClose={() => {
          setSignUpModal(false);
        }}
      />
    </>
  );
}

export default Login;
