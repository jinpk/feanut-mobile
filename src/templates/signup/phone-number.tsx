import React from 'react';
import {Controller} from 'react-hook-form';
import {StyleSheet, View} from 'react-native';
import {SignUpTemplateProps} from '.';
import {Button} from '../../components/button';
import {Errors} from '../../components/errors';
import {LargeInput} from '../../components/input/large-input';
import {Privacy} from '../../components';
import {Text} from '../../components/text';
import {BackTopBar} from '../../components/top-bar';
import {colors, constants} from '../../libs/common';

export const SignUpPhoneNumberTemplate = (props: SignUpTemplateProps) => {
  const errorsphoneNumber = props.form.formState.errors.phoneNumber
    ?.message as string;

  const sendingCode = props.form.watch().sendingCode;
  return (
    <View style={styles.root}>
      <BackTopBar onBack={props.onBack} />
      <Text weight="bold" size={18} mt={15} mx={16}>
        휴대폰번호를 입력해 주세요
      </Text>
      <Text mt={30} mx={16}>
        친구가 이미 회원님의 번호로 투표했을 수 있어요 {':)'}
      </Text>

      <Controller
        control={props.form.control}
        render={({field: {onChange, onBlur, value}}) => (
          <LargeInput
            autoFocus
            value={value}
            disabled={sendingCode}
            onChange={t => {
              onChange(t);
              props.form.clearErrors('phoneNumber');
            }}
            keyboardType="decimal-pad"
            onBlur={onBlur}
            maxLength={constants.phoneNumberMaxLength}
            placeholder={'01012345678'}
            mx={16}
            mt={14}
          />
        )}
        name="phoneNumber"
      />

      <Errors errors={[errorsphoneNumber]} mx={16} />

      <Privacy
        mx={16}
        mt={14}
        text={
          '회원님의 전화번호는 인증 용도로만 사용되며\nfeanut은 개인정보를 안전하게 관리합니다'
        }
      />

      <View style={{flex: 1}} />
      <Button
        disabled={Boolean(errorsphoneNumber)}
        onPress={props.onConfirm}
        title={'인증번호 보내기'}
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
