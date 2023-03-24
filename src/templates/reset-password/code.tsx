import React from 'react';
import {Controller} from 'react-hook-form';
import {StyleSheet, View} from 'react-native';
import {ResetPasswordTemplateProps} from '.';
import {Button} from '../../components/button';
import {Errors} from '../../components/errors';
import {LargeInput} from '../../components/input/large-input';
import {Text} from '../../components/text';
import {BackTopBar} from '../../components/top-bar';
import {colors, constants} from '../../libs/common';

export const FindPasswordCodeTemplate = (props: ResetPasswordTemplateProps) => {
  const errorscode = props.form.formState.errors.code?.message as string;

  return (
    <View style={styles.root}>
      <BackTopBar onBack={props.onBack} />
      <Text weight="bold" size={18} mt={15} mx={16}>
        문자로 인증번호를 보내드렸어요
      </Text>
      <Text mt={30} mx={16}>
        3분 이내로 인증번호 6자리를 입력해 주세요
      </Text>

      <Controller
        control={props.form.control}
        render={({field: {onChange, onBlur, value}}) => (
          <LargeInput
            autoFocus
            value={value}
            keyboardType="decimal-pad"
            onChange={t => {
              onChange(t);
              props.form.clearErrors('code');
            }}
            onBlur={onBlur}
            maxLength={6}
            placeholder={'000000'}
            mx={16}
            mt={14}
          />
        )}
        name="code"
      />

      <Errors errors={[errorscode]} mx={16} />

      <View style={{flex: 1}} />
      <Button
        disabled={Boolean(errorscode)}
        onPress={props.onConfirm}
        title={'인증번호 확인'}
        mx={16}
        mb={15}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.white,
    flex: 1,
    width: constants.screenWidth,
  },
});
