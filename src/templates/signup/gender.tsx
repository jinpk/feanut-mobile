import React from 'react';
import {Controller} from 'react-hook-form';
import {
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {SignUpTemplateProps} from '.';
import {Radios} from '../../components';
import {Button} from '../../components/button';
import {Errors} from '../../components/errors';
import {LargeInput} from '../../components/input/large-input';
import {Text} from '../../components/text';
import {BackTopBar} from '../../components/top-bar';
import {colors, constants, svgs} from '../../libs/common';

export const SignUpGenderTemplate = (props: SignUpTemplateProps) => {
  const errorsBirth = props.form.formState.errors.birth?.message as string;
  return (
    <View style={styles.root}>
      <BackTopBar onBack={props.onBack} />
      <Text weight="bold" size={18} mt={15} mx={16}>
        친구들이 알아볼 수 있도록 정보를 입력해 주세요
      </Text>
      <Text mt={30} mx={16}>
        생년월일 8자리를 입력해 주세요
      </Text>

      <Controller
        control={props.form.control}
        render={({field: {onChange, onBlur, value}}) => (
          <LargeInput
            autoFocus
            value={value}
            onChange={t => {
              onChange(t);
              props.form.clearErrors('birth');
            }}
            onBlur={onBlur}
            maxLength={8}
            keyboardType="decimal-pad"
            placeholder={'YYYYMMDD'}
            mx={16}
            mt={14}
          />
        )}
        name="birth"
      />

      <Errors errors={[errorsBirth]} mx={16} />

      <Text mt={57} mx={16}>
        성별을 선택해 주세요
      </Text>

      <Controller
        control={props.form.control}
        render={({field: {onChange, value}}) => (
          <View style={styles.genders}>
            <TouchableNativeFeedback
              onPress={() => {
                onChange('female');
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
            </TouchableNativeFeedback>
            <TouchableNativeFeedback
              onPress={() => {
                onChange('male');
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
            </TouchableNativeFeedback>
          </View>
        )}
        name="gender"
      />

      <View style={{flex: 1}} />
      <Button
        disabled={Boolean(errorsBirth)}
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
    backgroundColor: colors.white,
    flex: 1,
    width: constants.screenWidth,
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
