import {PagenatedRequest, QueryBoolean} from './common';
import {Gender} from './user';

export interface GetFriendsRequest extends PagenatedRequest {
  hidden?: QueryBoolean;

  keyword?: string;
}

export interface PatchFriendHiddenRequest {
  friendProfileIdId: string;
  hidden: boolean;
}

export interface AddFriend {
  name: string;
  phoneNumber: string;
}

export interface Friend {
  name: string;
  profileId: string;
  username?: string;
  hidden?: boolean;
  gender?: Gender;
  profileImageKey?: string;
}

export interface FriendshipStatus {
  friendsCount: number;
}

export interface AddFriendRequest extends AddFriend {}
