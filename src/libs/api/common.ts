import axios from 'axios';
import {feanutAPI} from '.';
import {
  Emoji,
  LocalImageResponse,
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

export const localImageURIToBlob = async (
  uri: string,
): Promise<LocalImageResponse> => {
  const data = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve({
        buffer: xhr.response as ArrayBuffer,
        type: xhr.getResponseHeader('content-type'),
      } as LocalImageResponse);
    };
    xhr.onerror = function () {
      reject(new TypeError('이미지 다운로드 실패 하였습니다.')); // error occurred, rejecting
    };
    xhr.responseType = 'arraybuffer'; // use BlobModule's UriHandler
    xhr.open('GET', uri, true); // fetch the blob from uri in async mode
    xhr.send(null); // no initial data
  });

  return data as LocalImageResponse;
};
