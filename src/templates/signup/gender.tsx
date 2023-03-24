import {Controller} from 'react-hook-form';
import {StyleSheet, View} from 'react-native';
import {SignUpTemplateProps} from '.';
import {Radios} from '../../components';
import {Button} from '../../components/button';
import {Errors} from '../../components/errors';
import {LargeInput} from '../../components/input/large-input';
import {Text} from '../../components/text';
import {BackTopBar} from '../../components/top-bar';
import {colors, constants} from '../../libs/common';

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
            placeholder={'yyyy mm dd'}
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
        render={({field: {onChange, onBlur, value}}) => (
          <Radios
            style={styles.genderRadios}
            data={constants.genders}
            value={value}
            onChagne={onChange}
          />
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
  genderRadios: {
    marginHorizontal: 16,
    marginTop: 15,
  },
});
