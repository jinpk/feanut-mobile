import {feanutAPI} from '..';
import {
  FeanutCard,
  GetPollingRoundLockResponse,
  Polling,
  PollingRound,
  PollingStats,
  PostPollingReqequest,
  PostPollingVoteRequest,
  PostPollingVoteResponse,
} from '../../interfaces/polling';

export const postPollingRound = async (
  target: 0 | 1,
): Promise<PollingRound> => {
  const res = await feanutAPI.post<PollingRound>('/pollings/rounds', {
    target,
  });
  return res.data;
};

export const getPollingRoundLock = async (): Promise<GetPollingRoundLockResponse> => {
  const res = await feanutAPI.get<GetPollingRoundLockResponse>('/pollings/rounds/lock', {});
  return res.data;
};

export const getPolling = async (pollingId: string): Promise<Polling> => {
  const res = await feanutAPI.get<Polling>('/pollings/' + pollingId, {});
  return res.data;
};

export const getPollingStatsByProfile = async (
  profileId: string,
): Promise<PollingStats> => {
  const res = await feanutAPI.get<PollingStats>(
    '/pollings/' + profileId + '/stats/byprofile',
    {},
  );
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

export const getFeanutCardByProfile = async (
  profileId: string,
): Promise<FeanutCard> => {
  const res = await feanutAPI.get<FeanutCard>(
    '/pollings/' + profileId + '/card/byprofile',
    {},
  );
  return res.data;
};
