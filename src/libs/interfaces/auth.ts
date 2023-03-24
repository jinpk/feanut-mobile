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
