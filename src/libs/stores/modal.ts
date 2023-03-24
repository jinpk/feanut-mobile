import {create} from 'zustand';

export interface ModalStore {
  welcome: boolean;

  actions: {
    openWelcome: () => void;
    closeWelcome: () => void;
  };
}

const initialState = {
  welcome: false,
};

export const useModalStore = create<ModalStore>(set => ({
  ...initialState,
  actions: {
    openWelcome: () => set({welcome: true}),
    closeWelcome: () => set({welcome: false}),
  },
}));
