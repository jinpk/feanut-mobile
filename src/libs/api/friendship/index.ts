import {feanutAPI} from '..';
import {AddFriendRequest} from '../../interfaces';

export const getHasFriends = async (userId: string): Promise<boolean> => {
  const res = await feanutAPI.get<boolean>(
    `/friendships/${userId}/friends/has`,
  );
  return res.data;
};

type Status = {friendsCount: number};
export const getFriendshipStatus = async (userId: string): Promise<Status> => {
  const res = await feanutAPI.get<Status>(`/friendships/${userId}/status`);
  return res.data;
};

export const postFriend = async (
  userId: string,
  data: AddFriendRequest,
): Promise<boolean> => {
  const res = await feanutAPI.post(`/friendships/${userId}/friends`, data);
  return res.data;
};
