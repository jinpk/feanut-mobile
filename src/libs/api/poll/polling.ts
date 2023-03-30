import {feanutAPI} from '..';
import {
  Polling,
  PollingRound,
  PostPollingReqequest,
  PostPollingVoteRequest,
  PostPollingVoteResponse,
} from '../../interfaces/polling';

export const postPollingRound = async (): Promise<PollingRound> => {
  const res = await feanutAPI.post<PollingRound>('/pollings/rounds', {});
  return res.data;
};

export const getPolling = async (pollingId: string): Promise<Polling> => {
  const res = await feanutAPI.get<Polling>('/pollings/' + pollingId, {});
  return res.data;
};

export const postPolling = async (
  params: PostPollingReqequest,
): Promise<Polling> => {
  const res = await feanutAPI.post<Polling>('/pollings', params);
  return res.data;
};

export const postPollingVote = async (
  pollingId: string,
  params: PostPollingVoteRequest,
): Promise<PostPollingVoteResponse> => {
  const res = await feanutAPI.post<PostPollingVoteResponse>(
    '/pollings/' + pollingId + '/vote',
    params,
  );
  return res.data;
};

export const postPollingRefresh = async (
  pollingId: string,
): Promise<Polling> => {
  const res = await feanutAPI.post<Polling>(
    '/pollings/' + pollingId + '/refresh',
  );
  return res.data;
};
