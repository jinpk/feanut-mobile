import {create} from 'zustand';
import {Emoji} from '../interfaces';

export interface EmojiStore {
  emojis: Emoji[];
  initialized: boolean;
  actions: {
    initialize: () => void;
    update: (emojis: Emoji[]) => void;
    push: (emojis: Emoji[]) => void;
  };
}

const initialState = {
  emojis: [],
  initialized: false,
};

export const useEmojiStore = create<EmojiStore>((set, get) => ({
  ...initialState,
  actions: {
    initialize: () => set({initialized: true}),
    update: (emojis: Emoji[]) => set({emojis}),
    push: (emojis: Emoji[]) => set({emojis: [...get().emojis, ...emojis]}),
  },
}));
