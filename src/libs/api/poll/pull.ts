import {feanutAPI} from '..';
import {PagenatedRequest, PagenatedResponse} from '../../interfaces';
import {
  PollingReceiveDetail,
  PollingReceiveItem,
} from '../../interfaces/polling';

export const deletePollings = async (
  pollingIds: string,
): Promise<PagenatedResponse<PollingReceiveItem>> => {
  const res = await feanutAPI.delete('/pollings/receive', {
    params: {pollingIds},
  });
  return res.data;
};

export const getPollingReceive = async (
  params: PagenatedRequest,
): Promise<PagenatedResponse<PollingReceiveItem>> => {
  const res = await feanutAPI.get<PagenatedResponse<PollingReceiveItem>>(
    '/pollings/receive',
    {
      params,
    },
  );
  return res.data;
};

export const getPollingReceiveDetail = async (
  pollingId: string,
): Promise<PollingReceiveDetail> => {
  const res = await feanutAPI.get<PollingReceiveDetail>(
    '/pollings/receive/' + pollingId,
    {},
  );
  return res.data;
};

export const openPull = async (pollingId: string): Promise<void> => {
  const res = await feanutAPI.post(
    '/pollings/receive/' + pollingId + '/open',
    {},
  );
  return res.data;
};
