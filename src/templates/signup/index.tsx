import {UseFormReturn} from 'react-hook-form';
import {SignUpForm} from '../../libs/interfaces';

export type SignUpTemplateProps = {
  form: UseFormReturn<SignUpForm>;
  focused: boolean;
  onConfirm: () => void;
  onBack: () => void;
};

export * from './gender';
export * from './code';
export * from './name';
export * from './phone-number';
