import * as Y from 'yjs';
import { v4 as uuidv4 } from 'uuid';
import { uniqueNamesGenerator, animals } from 'unique-names-generator';
import { Awareness } from 'y-protocols/awareness';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { CodeMirrorThemeType } from '~/contexts/ThemeManager';
import { Theme } from '@blocknote/react';

export interface HocuspocusProviderConfig extends HocuspocusProvider {
  url: string;
  name: string;
  document: Y.Doc;
  awareness: Awareness;
  token: string | (() => string) | (() => Promise<string>) | null;
  disconnect: () => void;
}

export interface CreateCodeEditorProps {
  content: Y.Text;
  id: string;
  awareness: Awareness;
  handleRunCode: () => void;
  editorTheme: CodeMirrorThemeType;
  hasOutput: boolean;
}

export interface MarkdownCellProps {
  id: string;
  content: Y.XmlFragment;
  cell: MarkdownCellType;
}

export interface ClientType {
  id?: number;
  name?: string;
  color?: string;
}

export interface MarkdownEditorProps {
  cell: MarkdownCellType;
  content: Y.XmlFragment;
  provider: HocuspocusProviderConfig;
  currentUser: ClientType | null;
  theme: Theme | "light" | "dark" | { light: Theme; dark: Theme; } | undefined;
}

export type CodeCellContent = Y.Text;
export type MarkdownCellContent = Y.XmlFragment;


export interface NotebookMetadata extends Y.Map<any> {
  executionCount: number;
  title: string | Y.Text;
}

export interface ProviderContextType {
  notebookMetadata: NotebookMetadata;
  docID: string;
  doc: any;
  provider: HocuspocusProviderConfig;
  awareness: Awareness;
}

export interface NotebookContextType {
  addCellAtIndex: (idx: number, type: string) => void;
  repositionCell: (cell: any, newIndex: number) => void;
  deleteCell: (id: string) => void;
  title: string;
  handleTitleChange: (newTitle: string) => void;
  allRunning: boolean;
  setAllRunning: React.Dispatch<React.SetStateAction<boolean>>;
}

export type CellType = CodeCellType | MarkdownCellType;

export interface CodeCellProps {
  cellId: string;
  cell: CodeCellType;
  content: Y.Text;
}

export type YMapEvent<T> = Y.YMapEvent<T>;

export interface CodeCellType extends Y.Map<any> {
  id: string;
  type: string;
  content: Y.Text;
  outputMap: Y.Map<any>;
  metaData: Y.Map<any>;
}

export interface MarkdownCellType extends Y.Map<any> {
  id: string;
  type: string;
  content: Y.XmlFragment;
}

export interface CellMetadata extends Y.Map<any> {
  isRunning: boolean;
  exeCount: number;
};

interface UserState {
  user: {
    name: string;
    color: string;
  } | null;
}

export const createContent = (type: string) => {
  if (type === 'code') return new Y.Text('');
  const xmlFragment = new Y.XmlFragment();
  const paragraph = new Y.XmlElement('paragraph');
  paragraph.setAttribute('data-block-id', 'turtle');
  const text = new Y.XmlText(' ');
  paragraph.insert(0, [text]);
  xmlFragment.insert(0, [paragraph]);
  return xmlFragment;
};

export const createCell = (type: string) => {
  const cell = new Y.Map();
  cell.set('id', uuidv4());
  cell.set('type', type);
  cell.set('content', createContent(type));
  if (type === 'code') {
    cell.set('outputMap', new Y.Map());
    const metadata = cell.set('metaData', new Y.Map());
    metadata.set('isRunning', false);
    metadata.set('exeCount', 0);
  }
  return cell;
};

export const yPrettyPrint = (ydoc: Y.Doc, msg = '') => {
  console.log('\n\n==> ' + msg + ': \n' + JSON.stringify(ydoc.toJSON(), null, 4) + '\n\n');
};


export const generateRandomName = () => {
  return uniqueNamesGenerator({ dictionaries: [animals], length: 1 });
};

export const getUserObjects = (states: Map<number, UserState>) => {
  return Array.from(states)
    .filter(([, state]) => state.user !== null)
    .map(item => ({
      id: item[0],
      name: item[1].user?.name,
      color: item[1].user?.color
    }));
};

export const randomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const codeTestingPromise = async () => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Success!');
    }, 2000);
  });
  return promise;
};
