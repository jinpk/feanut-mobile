export interface LoginForm {
  username: string;
  password: string;
  hasUsername: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}
