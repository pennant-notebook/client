import { YDoc, YMap } from "@/YjsTypes";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { Awareness } from "y-protocols/awareness";

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
  doc: YDoc;
  provider: HocuspocusProviderConfig;
  awareness: Awareness;
}
