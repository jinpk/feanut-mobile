import {feanutAPI} from '..';
import {
  LoginRequest,
  SignUpRequest,
  SignUpVerificationRequest,
  TokenRequest,
  TokenResponse,
} from '../../interfaces';

export const postLogin = async (body: LoginRequest): Promise<TokenResponse> => {
  const res = await feanutAPI.post<TokenResponse>(`/signin`, body);
  return res.data;
};

export const postToken = async (body: TokenRequest): Promise<TokenResponse> => {
  const res = await feanutAPI.post<TokenResponse>(`/token`, body);
  return res.data;
};

export const postSignUp = async (
  body: SignUpRequest,
): Promise<TokenResponse> => {
  const res = await feanutAPI.post<TokenResponse>(`/signup`, body);
  return res.data;
};

export const postSignUpVerification = async (
  body: SignUpVerificationRequest,
): Promise<string> => {
  const res = await feanutAPI.post<string>(`/signup/verification`, body);
  return res.data;
};
