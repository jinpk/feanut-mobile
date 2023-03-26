import {feanutAPI} from '..';
import {PatchProfileRequest, Profile} from '../../interfaces';

export const getMyProfile = async (): Promise<Profile> => {
  const res = await feanutAPI.get<Profile>('/profiles/me');
  return res.data;
};

export const patchProfile = async (
  profileId: string,
  data: PatchProfileRequest,
): Promise<any> => {
  const res = await feanutAPI.patch('/profiles/' + profileId, data);
  return res.data;
};
