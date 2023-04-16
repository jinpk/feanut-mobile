import {Source} from 'react-native-fast-image';
import {create} from 'zustand';

export interface ModalStore {
  welcome: boolean;
  coin: boolean;
  guide: boolean;
  image: boolean;
  imageSource: Source | number | undefined;

  webview: boolean;
  webviewURI: string;

  actions: {
    openGuide: () => void;
    closeGuide: () => void;

    openWelcome: () => void;
    closeWelcome: () => void;

    openCoin: () => void;
    closeCoin: () => void;

    openImage: (source: Source | number) => void;
    closeImage: () => void;

    openWebview: (uri: string) => void;
    closeWebview: () => void;
  };
}

const initialState = {
  welcome: false,
  coin: false,
  guide: false,
  image: false,
  webview: false,
  imageSource: undefined,
  webviewURI: '',
};

export const useModalStore = create<ModalStore>(set => ({
  ...initialState,
  actions: {
    openGuide: () => set({guide: true}),
    closeGuide: () => set({guide: false}),

    openImage: (imageSource: Source | number) =>
      set({image: true, imageSource}),
    closeImage: () => set({image: false, imageSource: undefined}),

    openWelcome: () => set({welcome: true}),
    closeWelcome: () => set({welcome: false}),

    openCoin: () => set({coin: true}),
    closeCoin: () => set({coin: false}),

    openWebview: (webviewURI: string) => set({webview: true, webviewURI}),
    closeWebview: () => set({webview: false, webviewURI: ''}),
  },
}));
