import { NotebookType } from '@/NotebookTypes';
import { atom, atomFamily } from 'recoil';

interface User {
  login: string;
  avatar_url?: string;
  avatar?: string;
  name?: string;
}
export const refreshState = atom({
  key: 'refreshState',
  default: false,
});


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

export const notebookTitleStateFamily = atomFamily<string, string>({
  key: 'notebookTitleStateFamily',
  default: 'Untitled',
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