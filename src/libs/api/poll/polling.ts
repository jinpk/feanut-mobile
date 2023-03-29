import {feanutAPI} from '..';
import {PollingRound} from '../../interfaces/polling';

export const postPollingRound = async (): Promise<PollingRound> => {
  const res = await feanutAPI.get<PollingRound>('/pollings/rounds', {});
  return res.data;
};
