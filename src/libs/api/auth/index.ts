import {feanutAPI} from '..';
import {
  LoginRequest,
  ResetPasswordRequest,
  ResetPasswordVerificationCodeRequest,
  ResetPasswordVerificationRequest,
  SignUpRequest,
  SignUpVerificationRequest,
  TokenRequest,
  TokenResponse,
} from '../../interfaces';

export const postLogin = async (body: LoginRequest): Promise<TokenResponse> => {
  const res = await feanutAPI.post<TokenResponse>('/signin', body);
  return res.data;
};

export const postToken = async (body: TokenRequest): Promise<TokenResponse> => {
  const res = await feanutAPI.post<TokenResponse>('/token', body);
  return res.data;
};

export const postSignUp = async (
  body: SignUpRequest,
): Promise<TokenResponse> => {
  const res = await feanutAPI.post<TokenResponse>('/signup', body);
  return res.data;
};

export const postSignUpVerification = async (
  body: SignUpVerificationRequest,
): Promise<string> => {
  const res = await feanutAPI.post<string>('/signup/verification', body);
  return res.data;
};

export const postResetPasswordVerification = async (
  body: ResetPasswordVerificationRequest,
): Promise<string> => {
  const res = await feanutAPI.post<string>('/resetpassword/verification', body);
  return res.data;
};

export const postResetPasswordVerificationCode = async (
  body: ResetPasswordVerificationCodeRequest,
) => {
  const res = await feanutAPI.post('/resetpassword/verification/code', body);
  return res.data;
};

export const postResetPassword = async (body: ResetPasswordRequest) => {
  const res = await feanutAPI.post('/resetpassword', body);
  return res.data;
};
