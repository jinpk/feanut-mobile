import {PagenatedRequest, PagenatedResponse} from './common';

export interface School {
  code: string;
  name: string;
  sido: string;
  sigungu: string;
  joinedCount: number;
}

export interface MySchool {
  code: string;
  name: string;
  room: number;
  grade: number;
  createdAt?: string;
}

export interface PostSchoolRequest {
  code: string;
  room: number;
  grade: number;
}

export interface GetListSchoolRequest extends PagenatedRequest {
  keyword: string;
}

export interface GetListSchoolResponse extends PagenatedResponse<School> {}

export interface PostMySchoolRequest {
  grade: number;
  room: number;
  code: string;
}
