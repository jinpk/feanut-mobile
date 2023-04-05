import React, {useEffect, useRef} from 'react';
import {Controller, UseFormReturn} from 'react-hook-form';
import {StyleSheet, TextInput, View} from 'react-native';
import {Button} from '../../components/button';
import {Errors} from '../../components/errors';
import {LargeInput} from '../../components/input/large-input';
import {Privacy} from '../../components';
import {Text} from '../../components/text';
import {BackTopBar} from '../../components/top-bar';
import {constants} from '../../libs/common';
import {PhoneNumberForm} from '../../libs/interfaces';

export type PhoneNumberTemplateProps = {
  form: UseFormReturn<PhoneNumberForm>;
  focused: boolean;
  onConfirm: () => void;
  onBack: () => void;

  title: string;
  message: string;
};

function PhoneNumberTemplate(props: PhoneNumberTemplateProps) {
  const errorsphoneNumber = props.form.formState.errors.phoneNumber
    ?.message as string;

  const sendingCode = props.form.watch().sendingCode;

  const phoneRef = useRef<TextInput>(null);

  useEffect(() => {
    let tm = setTimeout(() => {
      phoneRef.current?.focus();
    }, 1000);
    return () => {
      clearTimeout(tm);
    };
  }, [props.focused]);

  return (
    <View style={styles.root}>
      <BackTopBar onBack={props.onBack} />
      <Text weight="bold" size={18} mt={15} mx={16}>
        {props.title}
      </Text>
      <Text mt={30} mx={16}>
        {props.message}
      </Text>

      <Controller
        control={props.form.control}
        render={({field: {onChange, onBlur, value}}) => (
          <LargeInput
            autoFocus
            value={value}
            disabled={sendingCode}
            inputRef={phoneRef}
            onChange={t => {
              onChange(t);
              props.form.clearErrors('phoneNumber');
            }}
            onBlur={onBlur}
            maxLength={constants.phoneNumberMaxLength}
            placeholder={'01012345678'}
            mx={16}
            mt={14}
            keyboardType="number-pad"
            onSubmitEditing={() => {
              props.onConfirm();
            }}
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
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default PhoneNumberTemplate;
