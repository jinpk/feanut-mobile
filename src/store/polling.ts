import {create} from 'zustand';
import emotions from '../libs/emotions';

type Poll = {
  emotion: emotions;
};

interface PollingStoreActions {
  setLoading: (loading: boolean) => void;
  setPolls: (polls: Poll[]) => void;
  setPollIndex: (index: number) => void;
}

interface PollingState {
  // 투표조회중
  loading: boolean;
  // 투표
  polls: Poll[];
  // 투표조회
  pollings: any[];
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
  pollings: [],
};

export const usePollingStore = create<PollingStore>(set => ({
  ...initialState,
  actions: {
    setLoading: loading => set({loading}),
    setPolls: polls => set({polls}),
    setPollIndex: pollIndex => set({pollIndex}),
  },
}));
