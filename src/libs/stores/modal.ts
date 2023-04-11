import {create} from 'zustand';

export interface ModalStore {
  welcome: boolean;
  coin: boolean;
  guide: boolean;

  webview: boolean;
  webviewURI: string;

  actions: {
    openGuide: () => void;
    closeGuide: () => void;

    openWelcome: () => void;
    closeWelcome: () => void;

    openCoin: () => void;
    closeCoin: () => void;

    openWebview: (uri: string) => void;
    closeWebview: () => void;
  };
}

const initialState = {
  welcome: false,
  coin: false,
  guide: false,
  webview: false,
  webviewURI: '',
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

    openWebview: (webviewURI: string) => set({webview: true, webviewURI}),
    closeWebview: () => set({webview: false, webviewURI: ''}),
  },
}));
