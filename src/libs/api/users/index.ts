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
  const res = await feanutAPI.get<User>(`/users/me`);
  return res.data;
};
