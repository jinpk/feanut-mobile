import React from 'react';
import {Controller} from 'react-hook-form';
import {StyleSheet, View} from 'react-native';
import {ResetPasswordTemplateProps} from '.';
import {Button} from '../../components/button';
import {Errors} from '../../components/errors';
import {TextInput} from '../../components/input';
import {Text} from '../../components/text';
import {BackTopBar} from '../../components/top-bar';
import {constants} from '../../libs/common';

export const FindPasswordResetTemplate = (
  props: ResetPasswordTemplateProps,
) => {
  const errorscode =
    (props.form.formState.errors.password?.message as string) ||
    (props.form.formState.errors.passwordCheck?.message as string);

  return (
    <View style={styles.root}>
      <BackTopBar onBack={props.onBack} />
      <Text weight="bold" size={18} mt={15} mx={16}>
        변경하실 비밀번호를 입력해 주세요
      </Text>

      <Controller
        control={props.form.control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            value={value}
            onChange={t => {
              onChange(t);
              props.form.clearErrors('password');
            }}
            onBlur={onBlur}
            placeholder={'비밀번호'}
            maxLength={constants.passwordMaxLength}
            mx={16}
            mt={30}
            secureTextEntry
          />
        )}
        name="password"
      />

      <Controller
        control={props.form.control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            value={value}
            onChange={t => {
              onChange(t);
              props.form.clearErrors('passwordCheck');
            }}
            onBlur={onBlur}
            placeholder={'비밀번호 재확인'}
            maxLength={constants.passwordMaxLength}
            mx={16}
            mt={14}
            secureTextEntry
          />
        )}
        name="passwordCheck"
      />

      <Errors errors={[errorscode]} mx={16} />

      <View style={{flex: 1}} />
      <Button
        disabled={Boolean(errorscode)}
        onPress={props.onConfirm}
        title={'재설정하기'}
        mx={16}
        mb={15}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
