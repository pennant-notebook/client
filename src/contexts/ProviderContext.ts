import { useMemo } from 'react';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { createContext, useContext } from 'react';
import { IndexeddbPersistence } from 'y-indexeddb';
import { NotebookMetadata, ProviderContextType } from '~/utils/notebookHelpers';

export const initializeProvider = (docID: string) => {
  const provider = new HocuspocusProvider({
    url: `wss://hp.mafishi.io/collab/${docID}`,
    name: docID,
    token: import.meta.env.VITE_HP_ACCESS_TOKEN
  });

  const doc = provider.document;
  const persistence = new IndexeddbPersistence(docID, doc);

  const notebookMetadata = doc.getMap('metaData');

  persistence.on('synced', () => {
    console.log('🔮 Provider + IndexedDB Synced 🔮');

    if ((provider.document.get('metaData') as NotebookMetadata).get('executionCount') === undefined) {
      notebookMetadata.set('executionCount', 0);
    }
  });

  const contextValue = {
    notebookMetadata,
    docID,
    doc,
    provider,
    awareness: provider.awareness
  };

  return contextValue;
};

export const useProvider = (docID: string) => {
  const provider = useMemo(() => initializeProvider(docID), [docID]);
  return provider;
};



export const ProviderContext = createContext<ProviderContextType | null>(null);
const useProviderContext = () => useContext(ProviderContext);
export default useProviderContext;
