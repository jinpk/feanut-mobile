import * as yup from 'yup';
import {constants} from './constants';

export const yupValidators = {
  username: yup
    .string()
    .required('feanut ID를 입력해 주세요')
    .matches(/^[a-z1-9_]+$/, '영소문자, 숫자, _만 입력 가능합니다')
    .min(
      constants.usernameMinLength,
      `${constants.usernameMinLength}자리 이상으로 입력해 주세요`,
    )
    .max(
      constants.usernameMaxLength,
      `${constants.usernameMaxLength}자리 이하로 입력해 주세요`,
    ),

  password: yup
    .string()
    .required('비밀번호를 입력해 주세요')
    .matches(/^[A-Za-z1-9_@!#]+$/, '영문자, 숫자, _, @, !, #만 입력 가능합니다')
    .min(
      constants.passwordMinLength,
      `${constants.passwordMinLength}자리 이상으로 입력해 주세요`,
    )
    .max(
      constants.passwordMaxLength,
      `${constants.passwordMaxLength}자리 이하로 입력해 주세요`,
    ),

  birth: yup
    .string()
    .required('생년월일을 입력해 주세요')
    .length(8, '8자리로 입력해 주세요'),

  name: yup
    .string()
    .required('이름을 입력해 주세요')
    .max(
      constants.nameMaxLength,
      `${constants.nameMaxLength}자리 이하로 입력해 주세요`,
    ),

  phoneNumber: yup
    .string()
    .required('휴대폰번호를 입력해 주세요')
    .length(
      constants.phoneNumberMaxLength,
      `${constants.phoneNumberMaxLength}자리로 입력해 주세요`,
    ),
};
