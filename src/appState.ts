import { NotebookType } from '@/NotebookTypes';
import { HocuspocusProviderConfig } from '@/ProviderTypes';
import { atom, atomFamily } from 'recoil';

import { UserState } from './types/ClientTypes';

export const refreshState = atom({
  key: 'refreshState',
  default: false,
});

export const authState = atom<{
  isLoggedIn: boolean;
  userData: UserState | null;
  provider: 'github' | 'google' | 'username' | null;
}>({
  key: 'authState',
  default: {
    isLoggedIn: false,
    userData: {
      login: '',
      avatar_url: '',
      name: '',
      color: '',
      setByUser: false
    },
    provider: null,
  },
});

export const providerState = atom<HocuspocusProviderConfig | null>({
  key: 'providerState',
  default: null,
});

export const selectedDocIdState = atom<string | null>({
  key: 'selectedDocId',
  default: null,
});

export const notebookLanguageState = atom<string | null>({
  key: 'notebookLanguage',
  default: null,
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

export const sidebarExpandedState = atom({
  key: 'sidebarExpandedState',
  default: true,
});