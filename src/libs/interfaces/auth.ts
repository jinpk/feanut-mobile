export interface TokenRequest {
  refreshToken: string;
}

export interface SignUpRequest {
  authId: string;
  code: string;
}

export interface SignUpVerificationRequest {
  username: string;
  gender: 'female' | 'male';
  birth: string;
  name: string;
  phoneNumber: string;
}

export interface ResetPasswordVerificationRequest {
  username: string;
  phoneNumber: string;
}

export interface ResetPasswordVerificationCodeRequest {
  authId: string;
  code: string;
}

export interface ResetPasswordRequest {
  authId: string;
  password: string;
}

export interface ResetPasswordForm {
  username: string;
  phoneNumber: string;
  authId: string;
  code: string;
  password: string;
  passwordCheck: string;
  sendingCode: boolean;
}
