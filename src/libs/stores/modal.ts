import {create} from 'zustand';

export interface ModalStore {
  welcome: boolean;
  coin: boolean;

  actions: {
    openWelcome: () => void;
    closeWelcome: () => void;

    openCoin: () => void;
    closeCoin: () => void;
  };
}

const initialState = {
  welcome: false,
  coin: false,
};

export const useModalStore = create<ModalStore>(set => ({
  ...initialState,
  actions: {
    openWelcome: () => set({welcome: true}),
    closeWelcome: () => set({welcome: false}),

    openCoin: () => set({coin: true}),
    closeCoin: () => set({coin: false}),
  },
}));
