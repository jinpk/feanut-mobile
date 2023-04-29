import React, {useEffect, useRef} from 'react';
import {Controller} from 'react-hook-form';
import {
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {Button} from '../../components/button';
import {Errors} from '../../components/errors';
import {LargeInput} from '../../components/input/large-input';
import {Text} from '../../components/text';
import {BackTopBar} from '../../components/top-bar';
import {colors, constants, svgs} from '../../libs/common';
import {UseFormReturn} from 'react-hook-form';
import {SignUpForm} from '../../libs/interfaces';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export type SignUpTemplateProps = {
  form: UseFormReturn<SignUpForm>;
  onConfirm: () => void;
  onBack: () => void;
};

function SignUpTemplate(props: SignUpTemplateProps) {
  const insets = useSafeAreaInsets();
  const errorsName = props.form.formState.errors.name?.message as string;
  const errorsGender = props.form.formState.errors.gender?.message as string;

  const nameRef = useRef<TextInput>(null);

  useEffect(() => {
    let tm = setTimeout(() => {
      nameRef.current?.focus();
    }, 1000);
    return () => {
      clearTimeout(tm);
    };
  }, []);

  return (
    <View style={[styles.root, {paddingBottom: insets.bottom}]}>
      <BackTopBar onBack={props.onBack} />
      <Text weight="bold" size={18} mt={15} mx={16}>
        친구에게 내가 누구인지 알려주세요
      </Text>
      <Text mt={30} mx={16}>
        이름을 입력해주세요.
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
            //onSubmitEditing={props.onConfirm}
            maxLength={constants.nameMaxLength}
            placeholder={'피넛'}
            mx={16}
            mt={14}
          />
        )}
        name="name"
      />

      <Errors errors={[errorsName]} mx={16} />

      <Text mt={57} mx={16}>
        성별을 선택해주세요.
      </Text>

      <Controller
        control={props.form.control}
        render={({field: {onChange, value}}) => (
          <View style={styles.genders}>
            <TouchableWithoutFeedback
              onPress={() => {
                onChange('female');
                props.form.clearErrors('gender');
              }}>
              <View style={styles.genderWrap}>
                <WithLocalSvg
                  width={40}
                  height={20}
                  asset={
                    value === 'female' ? svgs.feanutYellow : svgs.feanutLight
                  }
                  fill="yellow"
                />
                <Text
                  size={27}
                  weight="medium"
                  ml={7}
                  color={value === 'female' ? colors.dark : colors.mediumGrey}>
                  여자
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                onChange('male');
                props.form.clearErrors('gender');
              }}>
              <View style={styles.genderWrap}>
                <WithLocalSvg
                  width={40}
                  height={20}
                  asset={value === 'male' ? svgs.feanutBlue : svgs.feanutLight}
                  fill="yellow"
                />

                <Text
                  size={27}
                  ml={7}
                  weight="medium"
                  color={value === 'male' ? colors.dark : colors.mediumGrey}>
                  남자
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        )}
        name="gender"
      />

      <Errors errors={[errorsGender]} mx={16} />

      <View style={{flex: 1}} />
      <Button
        disabled={Boolean(errorsName) || Boolean(errorsGender)}
        onPress={props.onConfirm}
        title={'다음'}
        mx={16}
        mb={15}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  genders: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    alignSelf: 'stretch',
  },
  genderWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});

export default SignUpTemplate;
