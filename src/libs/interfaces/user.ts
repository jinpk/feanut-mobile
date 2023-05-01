import {PagenatedRequest} from './common';

export type Gender = 'male' | 'female';
export interface User {
  id: string;
  phoneNumber: string;
}

export interface UserRecommendation {
  userId?: string;
  profileId?: string;
  name: string;
  profileImageKey?: string;
  gender?: Gender;
  phoneNumber?: string;
  school?: {
    name: string;
    grade: number;
  };
  isFriend?: boolean;
}

export interface GetUserRecommendation extends PagenatedRequest {
  schoolCode?: string;
  phoneNumber?: string;
}
