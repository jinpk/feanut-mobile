import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {useForm} from 'react-hook-form';
import {SignUpForm, VerificationParams} from '../libs/interfaces';
import SignUpTemplate from '../templates/signup';
import {constants, routes, yupValidators} from '../libs/common';
import {Keyboard, KeyboardAvoidingView, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const initialFormValues: SignUpForm = {
  name: '',
  gender: '',
};

function SignUp(): JSX.Element {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
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

    const params: VerificationParams = {
      type: 'signup',
      payload: form.getValues(),
    };

    navigation.navigate(routes.verification, params);
  }, []);

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
