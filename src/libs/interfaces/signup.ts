export interface SignUpForm {
  username: string;
  birth: string;
  gender: 'male' | 'female';
  name: string;
  phoneNumber: string;

  sendingCode: boolean;

  authId: string;
  code: string;
}
