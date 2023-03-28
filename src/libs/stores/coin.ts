import {create} from 'zustand';

export interface CoinStore {
  amount: number;
  pending: boolean;
  actions: {
    updateAmount: (amout: number) => void;
    setPending: (state: boolean) => void;
  };
}

const initialState = {
  amount: 0,
  pending: false,
};

export const useCoinStore = create<CoinStore>((set, get) => ({
  ...initialState,
  actions: {
    updateAmount: (amount: number) => set({amount}),
    setPending: (state: boolean) => set({pending: state}),
  },
}));
