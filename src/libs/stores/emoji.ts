import {create} from 'zustand';
import {Emoji} from '../interfaces';

export interface EmojiStore {
  emojis: Emoji[];
  actions: {
    update: (emojis: Emoji[]) => void;
    push: (emojis: Emoji[]) => void;
  };
}

const initialState = {
  emojis: [],
};

export const useEmojiStore = create<EmojiStore>((set, get) => ({
  ...initialState,
  actions: {
    update: (emojis: Emoji[]) => set({emojis}),
    push: (emojis: Emoji[]) => set({emojis: [...get().emojis, ...emojis]}),
  },
}));
