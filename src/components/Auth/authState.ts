import { atom } from 'recoil';

interface User {
  login: string;
  avatar_url?: string;
}

export const authState = atom<{
  isLoggedIn: boolean;
  userData: User | null;
  provider: 'github' | 'google' | 'username' | null;
}>({
  key: 'authState',
  default: {
    isLoggedIn: false,
    userData: null,
    provider: null,
  },
});
