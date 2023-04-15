export interface Profile {
  id: string;
  name: string;
  gender: 'male' | 'female';
  birth: string;
  statusMessage: string;
  profileImageKey: string;
  ownerId?: string;
  instagram?: string;
}

export interface ProfileForm {
  name: string;
  statusMessage: string;
  profileImage: any;
}

export interface PatchProfileRequest {
  name?: string;
  statusMessage?: string;
  imageFileId?: string | null;
  instagram?: string;
}
