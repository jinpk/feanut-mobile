import {feanutAPI} from '..';
import {LoginRequest, TokenRequest, TokenResponse} from '../../interfaces';

export const postLogin = async (body: LoginRequest): Promise<TokenResponse> => {
  const res = await feanutAPI.post<TokenResponse>(`/signin`, body);
  return res.data;
};

export const postToken = async (body: TokenRequest): Promise<TokenResponse> => {
  const res = await feanutAPI.post<TokenResponse>(`/token`, body);
  return res.data;
};
