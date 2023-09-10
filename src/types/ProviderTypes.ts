import { HocuspocusProvider } from '@hocuspocus/provider';
import { Awareness } from 'y-protocols/awareness';
import { YDoc, YMap } from '~/utils/notebookHelpers';


export interface HocuspocusProviderConfig extends HocuspocusProvider {
  url: string;
  name: string;
  doc: YDoc;
  awareness: Awareness;
  token: string | (() => string) | (() => Promise<string>) | null;
  disconnect: () => void;
}

export interface ProviderContextType {
  notebookMetadata: YMap;
  docID: string;
  doc: any;
  provider: HocuspocusProviderConfig;
  awareness: Awareness;
}


