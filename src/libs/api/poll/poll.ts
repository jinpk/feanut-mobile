import {feanutAPI} from '..';
import {Poll} from '../../interfaces/polling';

export const getPoll = async (pollId: string): Promise<Poll> => {
  const res = await feanutAPI.get<Poll>('/polls/' + pollId, {});
  return res.data;
};
