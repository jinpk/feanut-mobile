export interface APIErrorData {
  module: string;
  code: number;
  message: string;
}

export interface JWT {
  exp: number;
  sub: string;
}
