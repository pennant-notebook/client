import { NotebookType } from '@/NotebookTypes';
import { atom } from 'recoil';

interface User {
  login: string;
  avatar_url?: string;
  avatar?: string;
  name?: string;
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

export const notebooksState = atom<NotebookType[]>({
  key: 'notebooksState',
  default: [],
});

export const selectedNotebookState = atom<string | null>({
  key: 'selectedNotebookState',
  default: null,
});

export const usernameState = atom<string | null>({
  key: 'usernameState',
  default: null,
});