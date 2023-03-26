import {create} from 'zustand';
import {Profile} from '../interfaces';

export interface ProfileStore {
  profile: Profile;
  actions: {
    update: (profile: Profile) => void;
  };
}

const initialState: {profile: Profile} = {
  profile: {
    name: '',
    gender: 'female',
    birth: '',
    id: '',
    statusMessage: '',
    profileImageKey: '',
  },
};

export const useProfileStore = create<ProfileStore>((set, get) => ({
  ...initialState,
  actions: {
    update: (profile: Profile) => set({profile}),
  },
}));
