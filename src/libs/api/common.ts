import axios from 'axios';
import {feanutAPI} from '.';
import {
  Emoji,
  PagenatedRequest,
  PagenatedResponse,
  PostFileRequest,
  PostFileResponse,
} from '../interfaces';

export const getEmojis = async (
  params: PagenatedRequest,
): Promise<PagenatedResponse<Emoji>> => {
  const res = await feanutAPI.get<PagenatedResponse<Emoji>>('/emojis', {
    params,
  });
  return res.data;
};

export const postFile = async (
  data: PostFileRequest,
): Promise<PostFileResponse> => {
  const res = await feanutAPI.post<PostFileResponse>('/files', data);
  return res.data;
};

export const putObject = async (
  signedUrl: string,
  uri: string,
  contentType: string,
): Promise<any> => {
  const resp = await fetch(uri);
  const imageBody = await resp.blob();
  const res = await axios.put(signedUrl, imageBody, {
    headers: {
      'Content-Type': contentType,
    },
  });
  return res.data;
};
