import {create} from 'zustand';

export interface DynamicLinkStore {
  link: string;
  actions: {
    set: (link: string) => void;
    clear: () => void;
  };
}

const initialState = {
  link: '',
};

export const useDynamicLinkStore = create<DynamicLinkStore>((set, get) => ({
  ...initialState,
  actions: {
    set: (link: string) => set({link}),
    clear: () => set({link: ''}),
  },
}));
