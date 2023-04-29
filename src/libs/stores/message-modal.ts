import {Source} from 'react-native-fast-image';
import {create} from 'zustand';

export type MessageModalButtons = {
  text: string;
  onPress?: () => void;
  color?: string;
}[];

export interface MessageModalStore {
  open: boolean;
  message: string;
  buttons: MessageModalButtons;
  icon: Source | number | undefined;

  actions: {
    open: (
      message: string,
      buttons: MessageModalButtons,
      icon?: Source | number,
    ) => void;
    close: () => void;
  };
}

const initialState = {
  open: false,
  message: '',
  buttons: [],
  icon: undefined,
};

export const useMessageModalStore = create<MessageModalStore>(set => ({
  ...initialState,
  actions: {
    open: (
      message: string,
      buttons: MessageModalButtons,
      icon?: Source | number,
    ) => {
      set({
        message: message || '',
        buttons: buttons,
        icon,
        open: true,
      });
    },
    close: () => set({...initialState}),
  },
}));
