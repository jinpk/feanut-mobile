import {SignUpForm} from './signup';

export interface VerificationParams {
  type: 'signup' | 'signin';
  payload?: SignUpForm;
}
