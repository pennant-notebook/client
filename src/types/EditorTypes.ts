import { Awareness } from 'y-protocols/awareness';
import { CodeMirrorThemeType } from '~/contexts/ThemeManager';
import { YText, YXmlFragment } from '~/utils/notebookHelpers';
import { ClientType } from './ClientTypes';
import { HocuspocusProviderConfig } from './ProviderTypes';
import { Theme } from '@blocknote/react';

export interface CreateCodeEditorProps {
  content: YText;
  id: string;
  awareness: Awareness;
  handleRunCode: () => void;
  editorTheme: CodeMirrorThemeType;
  hasOutput: boolean;
}

export interface MarkdownEditorProps {
  content: YXmlFragment;
  provider: HocuspocusProviderConfig;
  currentUser: ClientType | null;
  theme: "light" | "dark" | Theme | { light: Theme; dark: Theme; } | undefined
}