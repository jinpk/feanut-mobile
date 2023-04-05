import {create} from 'zustand';

type VerificationType = undefined | 'signup' | 'signin';

export interface VerificationStore {
  payload: any;
  type: VerificationType;
  actions: {
    setType: (type: VerificationType) => void;
    setPayload: (payload: any) => void;
    clear: () => void;
  };
}

const initialState = {
  payload: null,
  type: undefined,
};

export const useVerificationStore = create<VerificationStore>((set, get) => ({
  ...initialState,
  actions: {
    setType: (type: VerificationType) => {
      set({type});
    },
    setPayload: (payload: any) => {
      set({payload});
    },
    clear: () => {
      set({type: undefined, payload: null});
    },
  },
}));
