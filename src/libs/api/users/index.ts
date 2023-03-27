import {feanutAPI} from '..';
import {User} from '../../interfaces';

export const getExistenceUserByUsername = async (
  username: string,
): Promise<boolean> => {
  const res = await feanutAPI.get<boolean>(
    `/users/existence/by/username/${username}`,
  );
  return res.data;
};

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
