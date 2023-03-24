import {create} from 'zustand';
import emotions from '../libs/emotions';

interface Friend {
  value: string;
}

interface Polling {
  friends: Friend[];
}

type Poll = {
  id: string;
  emotion: emotions;
  skip: boolean;
  selectedFriend: string;
  polling: Polling | null;
};

interface PollingStoreActions {
  setLoading: (loading: boolean) => void;
  setPolls: (polls: Poll[]) => void;
  setPollIndex: (index: number) => void;
  setPollSelected: (pollId: string, freindId: string) => void;
  skipPoll: (pollId: string) => void;
}

interface PollingState {
  // 투표조회중
  loading: boolean;
  // 투표
  polls: Poll[];
  // 투표중 Poll index
  pollIndex: number;
}

interface PollingStore extends PollingState {
  actions: PollingStoreActions;
}

const initialState: PollingState = {
  loading: false,
  polls: [],
  pollIndex: 0,
};

export const usePollingStore = create<PollingStore>(set => ({
  ...initialState,
  actions: {
    setLoading: loading => set({loading}),
    setPolls: polls => set({polls}),
    setPollIndex: pollIndex => set({pollIndex}),
    setPollSelected: (pollId, selectedFriend) =>
      set(state => ({
        polls: [
          ...state.polls.map(x => {
            if (x.id === pollId) {
              x.selectedFriend = selectedFriend;
            }
            return x;
          }),
        ],
      })),
    skipPoll: pollId => {
      set(state => ({
        polls: [
          ...state.polls.map(x => {
            if (x.id === pollId) {
              x.skip = true;
            }
            return x;
          }),
        ],
      }));
    },
  },
}));
