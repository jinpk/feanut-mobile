import {feanutAPI} from '..';
import {
  AddFriendRequest,
  FriendshipStatus,
  GetFriendsRequest,
  Friend,
  PagenatedResponse,
  PatchFriendHiddenRequest,
} from '../../interfaces';

export const patchFriendHidden = async (
  userId: string,
  params: PatchFriendHiddenRequest,
): Promise<PagenatedResponse<void>> => {
  const res = await feanutAPI.patch<PagenatedResponse<void>>(
    `/friendships/${userId}/friends/hidden`,
    params,
  );
  return res.data;
};

export const getFriends = async (
  userId: string,
  params: GetFriendsRequest,
): Promise<PagenatedResponse<Friend>> => {
  const res = await feanutAPI.get<PagenatedResponse<Friend>>(
    `/friendships/${userId}/friends`,
    {
      params,
    },
  );
  return res.data;
};

export const getHasFriends = async (userId: string): Promise<boolean> => {
  const res = await feanutAPI.get<boolean>(
    `/friendships/${userId}/friends/has`,
  );
  return res.data;
};

export const getFriendshipStatus = async (
  userId: string,
): Promise<FriendshipStatus> => {
  const res = await feanutAPI.get<FriendshipStatus>(
    `/friendships/${userId}/stats`,
  );
  return res.data;
};

export const postFriend = async (
  userId: string,
  data: AddFriendRequest,
): Promise<boolean> => {
  const res = await feanutAPI.post(`/friendships/${userId}/friends`, data);
  return res.data;
};
