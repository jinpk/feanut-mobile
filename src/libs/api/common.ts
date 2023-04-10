import axios from 'axios';
import {feanutAPI} from '.';
import {
  Emoji,
  LocalImageResponse,
  OptionalPagingReqDto,
  PagenatedResponse,
  PostFileRequest,
  PostFileResponse,
} from '../interfaces';
import {readFile, stat} from 'react-native-fs';
import {decode} from 'base64-arraybuffer';

export const getEmojis = async (
  params: OptionalPagingReqDto,
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
  object: LocalImageResponse,
): Promise<void> => {
  try {
    await axios({
      url: signedUrl,
      method: 'PUT',
      data: object.buffer,
      headers: {
        'Content-Type': object.type,
      },
    });
  } catch (error: any) {
    throw new Error(error.message || JSON.stringify(error));
  }
};

export const localImageURIToArrayBuffer = async (
  uri: string,
): Promise<ArrayBuffer> => {
  const base64 = await readFile(uri, 'base64');

  return decode(base64);
};
