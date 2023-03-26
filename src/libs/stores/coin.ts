import {create} from 'zustand';

export interface CoinStore {
  amount: number;
  actions: {
    updateAmount: (amout: number) => void;
  };
}

const initialState = {
  amount: 0,
};

export const useCoinStore = create<CoinStore>((set, get) => ({
  ...initialState,
  actions: {
    updateAmount: (amount: number) => set({amount}),
  },
}));
