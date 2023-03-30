import {emotions} from '../common';
import {Friend} from './friend';

export interface InternalPolling {
  userRoundId: string;

  pollId: string;
  pollingId?: string;
  isVoted: boolean;

  title?: string;
  emotion?: emotions;
  emojiURI?: string;

  friends: Friend[];

  selectedProfileId?: string;
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
  friendIds: any;
  isVoted: boolean;
}

export interface PollingRound {
  maxDailyCount: number;
  todayCount: number;
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
