import { Awareness } from 'y-protocols/awareness';
import { CodeMirrorThemeType } from '~/contexts/ThemeManager';
import { YText, YXmlFragment } from '~/utils/notebookHelpers';
import { AwarenessUserState } from './ClientTypes';
import { HocuspocusProviderConfig } from './ProviderTypes';
import { Theme } from '@blocknote/react';

export interface CreateCodeEditorProps {
  content: YText;
  id: string;
  awareness: Awareness;
  handleRunCode: () => void;
  editorTheme: CodeMirrorThemeType;
  hasOutput: boolean;
  language: string;
  notebookTheme: string;
}

export interface MarkdownEditorProps {
  content: YXmlFragment;
  provider: HocuspocusProviderConfig;
  currentUser: AwarenessUserState | null;
  theme: "light" | "dark" | Theme | { light: Theme; dark: Theme; } | undefined
}