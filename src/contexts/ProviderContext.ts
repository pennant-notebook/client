import { ProviderContextType } from '@/ProviderTypes';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { createContext, useContext, useMemo } from 'react';
import { IndexeddbPersistence } from 'y-indexeddb';
import { YMap } from '~/utils/notebookHelpers';

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
    // when running tests, uncomment line below to allow playwright to inspect the provider object
    // console.log(provider)
    if ((provider.document.get('metaData') as YMap).get('executionCount') === undefined) {
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
