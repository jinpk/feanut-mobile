export interface TokenRequest {
  refreshToken: string;
}

export interface SignUpRequest {
  authId: string;
  code: string;
}

export interface SignUpVerificationRequest {
  gender: 'female' | 'male';
  name: string;
  phoneNumber: string;
}

export interface PhoneNumberForm {
  phoneNumber: string;
  authId: string;
  code: string;
  sendingCode: boolean;
}
