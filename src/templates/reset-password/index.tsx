import {UseFormReturn} from 'react-hook-form';
import {ResetPasswordForm} from '../../libs/interfaces';

export type ResetPasswordTemplateProps = {
  form: UseFormReturn<ResetPasswordForm>;
  focused: boolean;
  onConfirm: () => void;
  onBack: () => void;
};

export * from './phone-number';
export * from './code';
export * from './reset';
