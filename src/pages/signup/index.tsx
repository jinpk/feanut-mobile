import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {useForm} from 'react-hook-form';
import {SignUpForm, SignUpRequest} from '../../libs/interfaces';
import SignUpTemplate from '../../templates/signup';
import {constants, pngs, routes, yupValidators} from '../../libs/common';
import {Keyboard, KeyboardAvoidingView, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useMessageModalStore} from '../../libs/stores/message-modal';
import {useSignUp} from '../../hooks/use-signup';

const initialFormValues: SignUpForm = {
  name: '',
  gender: '',
};

function SignUp(): JSX.Element {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {params} = useRoute<RouteProp<{SignUp: {authId: string}}, 'SignUp'>>();
  const openMessageModal = useMessageModalStore(s => s.actions.open);
  const signUp = useSignUp();
  const form = useForm<SignUpForm>({
    defaultValues: initialFormValues,
  });

  const handleConfirm = useCallback(async () => {
    const name = form.getValues('name');
    try {
      await yupValidators.name.validate(name);
    } catch (error: any) {
      form.setError('name', error);
      return;
    }

    const gender = form.getValues('gender');
    if (!gender) {
      form.setError('gender', {message: '성별을 선택해 주세요'});
      return;
    }

    Keyboard.dismiss();

    const body: SignUpRequest = {
      gender,
      name,
      authId: params.authId,
    };

    openMessageModal(
      `${body.name}님 학생이신가요?\n\n재학중인 학교를 선택하면\n학교 친구를 추가할 수 있어요!`,
      [
        {
          text: '아닙니다',
          onPress: () => {
            signUp(body);
          },
        },
        {
          text: '학생입니다',
          onPress: () => {
            navigation.navigate(routes.signupSchool, {payload: body});
          },
        },
      ],
      pngs.school,
    );
  }, [params.authId]);

  return (
    <KeyboardAvoidingView
      style={[styles.root, {paddingBottom: insets.bottom}]}
      {...(constants.platform === 'ios' ? {behavior: 'padding'} : {})}>
      <SignUpTemplate
        form={form}
        onConfirm={handleConfirm}
        onBack={navigation.goBack}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default SignUp;
