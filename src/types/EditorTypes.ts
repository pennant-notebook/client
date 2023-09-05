import { Awareness } from 'y-protocols/awareness';
import { CodeMirrorThemeType } from '~/contexts/ThemeManager';
import { YText, YXmlFragment } from '~/utils/notebookHelpers';
import { MarkdownCellType } from './CellTypes';
import { ClientType } from './ClientTypes';
import { HocuspocusProviderConfig } from './ProviderTypes';

export interface CreateCodeEditorProps {
  content: YText;
  id: string;
  awareness: Awareness;
  handleRunCode: () => void;
  editorTheme: CodeMirrorThemeType;
  hasOutput: boolean;
}

export interface MarkdownEditorProps {
  cell: MarkdownCellType;
  content: YXmlFragment;
  provider: HocuspocusProviderConfig;
  currentUser: ClientType | null;
  theme: string | undefined;
}