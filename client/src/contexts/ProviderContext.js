import { useMemo } from 'react';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { createContext, useContext } from 'react';
import { IndexeddbPersistence } from 'y-indexeddb';

export const initializeProvider = docID => {
  const provider = new HocuspocusProvider({
    url: `wss://hp.mafishi.io/collab/${docID}`,
    name: docID,
    token: import.meta.env.VITE_HP_ACCESS_TOKEN
  });

  const doc = provider.document;
  const persistence = new IndexeddbPersistence(docID, doc);

  const notebookMetadata = doc.getMap('metaData');

  persistence.on('synced', () => {
    console.log('🔮 IndexedDB synced 🔮 ');
    console.log(provider.configuration.url);

    if (provider.document.get('metaData').get('executionCount') === undefined) {
      notebookMetadata.set('executionCount', 0);
    }
  });

  const contextValue = {
    notebookMetadata,
    docID,
    doc,
    provider,
    persistence,
    awareness: provider.awareness
  };

  return contextValue;
};

export const useProvider = docID => {
  const provider = useMemo(() => initializeProvider(docID), [docID]);
  return provider;
};

export const ProviderContext = createContext();
const useProviderContext = () => useContext(ProviderContext);
export default useProviderContext;
