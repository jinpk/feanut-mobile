import {PostSchoolRequest, School} from './school';

export interface TokenRequest {
  refreshToken: string;
}

export interface SignUpRequest {
  authId: string;
  gender: 'female' | 'male';
  name: string;

  school?: PostSchoolRequest;
}

export interface SignUpVerificationRequest {
  phoneNumber: string;
}

export interface SignUpVerificationConfirmationRequest {
  authId: string;
  code: string;
}

export interface PhoneNumberForm {
  phoneNumber: string;
  authId: string;
  code: string;
  sendingCode: boolean;
}
