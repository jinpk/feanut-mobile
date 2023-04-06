import {create} from 'zustand';

export interface ModalStore {
  welcome: boolean;
  coin: boolean;
  guide: boolean;

  actions: {
    openGuide: () => void;
    closeGuide: () => void;

    openWelcome: () => void;
    closeWelcome: () => void;

    openCoin: () => void;
    closeCoin: () => void;
  };
}

const initialState = {
  welcome: false,
  coin: false,
  guide: false,
};

export const useModalStore = create<ModalStore>(set => ({
  ...initialState,
  actions: {
    openGuide: () => set({guide: true}),
    closeGuide: () => set({guide: false}),

    openWelcome: () => set({welcome: true}),
    closeWelcome: () => set({welcome: false}),

    openCoin: () => set({coin: true}),
    closeCoin: () => set({coin: false}),
  },
}));
