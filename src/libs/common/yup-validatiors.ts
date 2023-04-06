import * as yup from 'yup';
import {constants} from './constants';

export const yupValidators = {
  name: yup
    .string()
    .required('이름을 입력해 주세요')
    .max(
      constants.nameMaxLength,
      `${constants.nameMaxLength}자리 이하로 입력해 주세요`,
    ),

  phoneNumber: yup
    .string()
    .required('전화번호를 입력해 주세요')
    .length(
      constants.phoneNumberMaxLength,
      `${constants.phoneNumberMaxLength}자리로 입력해 주세요`,
    ),
};
