import {PagenatedRequest, PagenatedResponse} from './common';

export interface School {
  code: string;
  name: string;
  sido: string;
  sigungu: string;
  joinedCount: number;
}

export interface PostSchoolRequest {
  code: string;
  grade: number;
}

export interface GetListSchoolRequest extends PagenatedRequest {
  keyword: string;
}

export interface GetListSchoolResponse extends PagenatedResponse<School> {}
