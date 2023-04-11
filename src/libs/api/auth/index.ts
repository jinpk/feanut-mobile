import {feanutAPI} from '..';
import {
  AuthResponse,
  SignInRequest,
  SignInVerificationRequest,
  SignUpRequest,
  SignUpVerificationRequest,
  TokenRequest,
  TokenResponse,
} from '../../interfaces';

export const postSignOut = async () => {
  const res = await feanutAPI.post('/signout');
  return res.data;
};

export const postSignInVerification = async (
  body: SignInVerificationRequest,
): Promise<AuthResponse> => {
  const res = await feanutAPI.post<AuthResponse>('/signin/verification', body);
  return res.data;
};

export const postSignIn = async (
  body: SignInRequest,
): Promise<TokenResponse> => {
  const res = await feanutAPI.post<TokenResponse>('/signin', body);
  return res.data;
};

export const postToken = async (body: TokenRequest): Promise<TokenResponse> => {
  const res = await feanutAPI.post<TokenResponse>('/token', body);
  return res.data;
};

export const postSignUpVerification = async (
  body: SignUpVerificationRequest,
): Promise<AuthResponse> => {
  const res = await feanutAPI.post<AuthResponse>('/signup/verification', body);
  return res.data;
};

export const postSignUp = async (
  body: SignUpRequest,
): Promise<TokenResponse> => {
  const res = await feanutAPI.post<TokenResponse>('/signup', body);
  return res.data;
};
