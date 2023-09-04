import { Theme } from '@blocknote/react';
import { Awareness } from 'y-protocols/awareness';
import { CodeMirrorThemeType } from '~/contexts/ThemeManager';
import { YTypes } from '~/utils/notebookHelpers';
import { MarkdownCellType } from './CellTypes';
import { ClientType } from './ClientTypes';
import { HocuspocusProviderConfig } from './ProviderTypes';

export interface CreateCodeEditorProps {
  content: YTypes['Text'];
  id: string;
  awareness: Awareness;
  handleRunCode: () => void;
  editorTheme: CodeMirrorThemeType;
  hasOutput: boolean;
}

export interface MarkdownEditorProps {
  cell: MarkdownCellType;
  content: YTypes['XmlFragment'];
  provider: HocuspocusProviderConfig;
  currentUser: ClientType | null;
  theme: Theme | "light" | "dark" | { light: Theme; dark: Theme; } | undefined;
}