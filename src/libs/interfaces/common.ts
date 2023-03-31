export type FeanutImageGender = 'm' | 'w';

export type QueryBoolean = '0' | '1';

export interface PagenatedRequest {
  page: number;
  limit: number;
}

export interface PagenatedResponse<T> {
  data: T[];
  total: number;
}

export interface APIErrorData {
  module: string;
  code: number;
  message: string;
}

export interface JWT {
  exp: number;
  sub: string;
}

export interface PostFileRequest {
  purpose: 'profileimage';
  contentType: string;
}

export interface PostFileResponse {
  fileId: string;
  signedUrl: string;
}

export interface APIError extends APIErrorData {
  status: number;
  path: string;
  method: string;
}
