import { HocuspocusProvider } from '@hocuspocus/provider';
import { createContext, useContext } from 'react';

const idToProviderMap = new Map();
const idtoDocMap = new Map();

export const initializeProvider = (docID, user) => {
  // console.log('token -> ', import.meta.env.VITE_HP_ACCESS_TOKEN);
  let provider = idToProviderMap.get(docID);
  if (!provider) {
    provider = new HocuspocusProvider({
      url: import.meta.env.VITE_WEBSOCKET_SERVER,
      name: docID,
      token: import.meta.env.VITE_HP_ACCESS_TOKEN
    });
    idToProviderMap.set(docID, provider);
  }

  let doc = idtoDocMap.get(docID);
  if (!doc) {
    doc = provider.document;
    idtoDocMap.set(docID, doc);
  }

  const notebookMetadata = doc.getMap('metaData');
  const cellsArray = doc.getArray('cells');

  provider.on('synced', () => {
    if (provider.document.get('metaData').get('executionCount') === undefined) {
      notebookMetadata.set('executionCount', 0);
    }
    console.log('PROVIDER SYNCED');
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
