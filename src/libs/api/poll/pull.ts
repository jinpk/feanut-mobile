import {feanutAPI} from '..';
import {PagenatedRequest, PagenatedResponse} from '../../interfaces';
import {
  PollingReceiveDetail,
  PollingReceiveItem,
} from '../../interfaces/polling';

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
