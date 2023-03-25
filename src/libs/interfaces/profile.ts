export interface Profile {
  id: string;
  name: string;
  gender: 'male' | 'female';
  birth: string;
  statusMessage: string;
  profileImageKey: string;
}
