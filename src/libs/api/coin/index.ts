import {feanutAPI} from '..';
import {GetCoinResponse, PurchaseCoin} from '../../interfaces';

export const getMyCoin = async (): Promise<GetCoinResponse> => {
  const res = await feanutAPI.get<GetCoinResponse>('/coins/me');
  return res.data;
};

export const postPurchaseCoin = async (body: PurchaseCoin): Promise<void> => {
  const res = await feanutAPI.post('/coins/purchase', body);
  return res.data;
};
