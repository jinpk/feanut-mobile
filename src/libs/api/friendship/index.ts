import {feanutAPI} from '..';
import {
  AddFriendRequest,
  FriendshipStatus,
  GetFriendsRequest,
  Friend,
  PagenatedResponse,
  PatchFriendHiddenRequest,
  AddFriendManyRequest,
  AddFriendManyResponse,
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

export const getFriendByProfileId = async (
  userId: string,
  profileId: string,
): Promise<Friend> => {
  const res = await feanutAPI.get<Friend>(
    `/friendships/${userId}/friends/${profileId}/byprofile`,
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

export const getFriendshipStatusByProfile = async (
  profileId: string,
): Promise<FriendshipStatus> => {
  const res = await feanutAPI.get<FriendshipStatus>(
    `/friendships/${profileId}/stats/byprofile`,
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

export const postFriendByUser = async (
  userId: string,
  targetUserId: string,
  name: string,
): Promise<boolean> => {
  const res = await feanutAPI.post(`/friendships/${userId}/friends/byuser`, {
    userId: targetUserId,
    name,
  });
  return res.data;
};

export const postFriendsMany = async (
  userId: string,
  data: AddFriendManyRequest,
): Promise<AddFriendManyResponse> => {
  const res = await feanutAPI.post<AddFriendManyResponse>(
    `/friendships/${userId}/friends/many`,
    data,
  );
  return res.data;
};

export const getLegacyFriendship = async (userId: string): Promise<Boolean> => {
  const res = await feanutAPI.get<Boolean>(`/friendships/${userId}/legacy`);
  return res.data;
};

export const postClearFriendsForLegacy = async (userId: string) => {
  const res = await feanutAPI.post(`/friendships/${userId}/legacy/clear`);
  return res.data;
};
