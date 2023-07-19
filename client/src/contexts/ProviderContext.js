import { HocuspocusProvider } from '@hocuspocus/provider';
import { createContext, useContext } from 'react';

const hocuspocusURL = import.meta.env.VITE_MAFISHI_SERVER;

export const initializeProvider = (docID, user) => {
  const provider = new HocuspocusProvider({
    url: hocuspocusURL,
    name: docID,
    token: import.meta.env.VITE_HP_ACCESS_TOKEN
  });

  const doc = provider.document;

  const notebookMetadata = doc.getMap('metaData');
  const cellsArray = doc.getArray('cells');

  provider.on('synced', () => {
    console.log('🔮 PROVIDER SYNCED 🔮 ');
    if (provider.document.get('metaData').get('executionCount') === undefined) {
      notebookMetadata.set('executionCount', 0);
    }
  });

  const contextValue = {
    notebookMetadata,
    user,
    docID,
    doc,
    provider,
    awareness: provider.awareness
  };

  return contextValue;
};

export const ProviderContext = createContext();
const useProviderContext = () => useContext(ProviderContext);
export default useProviderContext;
