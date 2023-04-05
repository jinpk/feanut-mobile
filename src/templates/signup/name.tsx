import React, {useEffect, useRef} from 'react';
import {Controller} from 'react-hook-form';
import {StyleSheet, TextInput, View} from 'react-native';
import {SignUpTemplateProps} from '.';
import {Button} from '../../components/button';
import {Errors} from '../../components/errors';
import {LargeInput} from '../../components/input/large-input';
import {Text} from '../../components/text';
import {BackTopBar} from '../../components/top-bar';
import {colors, constants} from '../../libs/common';

export const SignUpNameTemplate = (props: SignUpTemplateProps) => {
  const errorsName = props.form.formState.errors.name?.message as string;
  const nameRef = useRef<TextInput>(null);

  useEffect(() => {
    if (props.focused) {
      nameRef.current?.focus();
    }
  }, [props.focused]);

  return (
    <View style={styles.root}>
      <BackTopBar onBack={props.onBack} />
      <Text weight="bold" size={18} mt={15} mx={16}>
        이름을 입력해 주세요
      </Text>
      <Text mt={30} mx={16}>
        친구가 투표할 때 보게 될 이름이에요
      </Text>

      <Controller
        control={props.form.control}
        render={({field: {onChange, onBlur, value}}) => (
          <LargeInput
            inputRef={nameRef}
            autoFocus
            value={value}
            onChange={t => {
              onChange(t);
              props.form.clearErrors('name');
            }}
            onBlur={onBlur}
            returnKeyType="next"
            onSubmitEditing={props.onConfirm}
            maxLength={constants.nameMaxLength}
            placeholder={'피넛'}
            mx={16}
            mt={14}
          />
        )}
        name="name"
      />

      <Errors errors={[errorsName]} mx={16} />

      <View style={{flex: 1}} />
      <Button
        disabled={Boolean(errorsName)}
        onPress={props.onConfirm}
        title={'확인'}
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
