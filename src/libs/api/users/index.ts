import {feanutAPI} from '..';
import {
  GetUserRecommendation,
  PagenatedResponse,
  User,
  UserRecommendation,
} from '../../interfaces';

export const getMe = async (): Promise<User> => {
  const res = await feanutAPI.get<User>('/users/me');
  return res.data;
};

export const deleteMe = async (reason: string): Promise<void> => {
  const res = await feanutAPI.delete('/users/me', {
    params: {reason: encodeURIComponent(reason)},
  });
  return res.data;
};

export const getUserRecommendation = async (params: GetUserRecommendation) => {
  const res = await feanutAPI.get<PagenatedResponse<UserRecommendation>>(
    '/users/recommendation',
    {
      params,
    },
  );
  return res.data;
};
