import {Source} from 'react-native-fast-image';
import {emotions} from '../common';
import {Friend} from './friend';
import {Gender} from './user';

export interface InternalPolling {
  pollId: string;
  pollingId?: string;
  isVoted: boolean;

  title?: string;
  emotion?: emotions;
  emojiURI?: string;

  friends: PollingFriendItem[];

  selectedProfileId?: string;
}

export interface PollingFriendItem {
  label: string;
  source?: Source | number;
  value: string;
  gender: Gender;
}

export interface PollingFriend {
  imageFileKey?: string;
  gender?: Gender;
  name: string;
  profileId: string;
}

export interface Poll {
  contentText: string;
  emojiId: string;
  emotion: string;
}

export interface Polling {
  id: string;
  userRoundId: string;
  pollId: Poll;
  friendIds: PollingFriend[];
  isVoted: boolean;
}

export interface PollingRound {
  maxDailyCount: number;
  todayCount: number;
  remainTime: number;
  recentCompletedAt: string;
  data?: UserRound;
}

interface PollingId {
  _id: string;
  isVoted: boolean;
  pollId: string;
}

export interface UserRound {
  id: string;
  roundId: string;
  pollIds: string[];
  pollingIds: PollingId[];
  complete: boolean;
}

export interface PostPollingReqequest {
  pollId: string;
  userRoundId: string;
}
export interface PostPollingVoteRequest {
  selectedProfileId?: string;
  skipped?: boolean;
}

export interface RoundEvent {
  id: string;
  message: string;
  subMessage: string;
  markingText: string;
  emojiId: string;
  reward: number;
}

export interface PostPollingVoteResponse {
  userroundCompleted: boolean;
  roundEvent?: RoundEvent;
}

export interface ReceivePolling {
  id: string;
  userName: string;
}

export interface PollingReceiveItem {
  _id: string;
  pollId: string;
  completedAt: string;
  isOpened?: boolean;
  name?: string;
  gender: Gender;
  imageFileKey?: string;
}

export interface PollingReceiveDetail {
  _id: string;
  pollId: Poll;
  userRoundId: string;
  friendIds: PollingFriend[];
  selectedProfileId: string;
  completedAt: string;

  isOpened?: boolean;

  voter: {
    name?: string;
    gender: Gender;
    imageFileKey?: string;
    profileId?: string;
  };
}

export interface PollingStats {
  pollsCount: number;
  pullsCount: number;
}

export interface FeanutCard {
  joy: number;
  gratitude: number;
  serenity: number;
  interest: number;
  hope: number;
  pride: number;
  amusement: number;
  inspiration: number;
  awe: number;
  love: number;
}
