export interface SignInVerificationRequest {
  phoneNumber: string;
}

export interface SignInRequest {
  authId: string;
  code: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  authId: string;
}
