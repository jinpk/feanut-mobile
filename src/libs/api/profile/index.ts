import {feanutAPI} from '..';
import {Profile} from '../../interfaces';

export const getMyProfile = async (): Promise<Profile> => {
  const res = await feanutAPI.get<Profile>('/profiles/me');
  return res.data;
};
