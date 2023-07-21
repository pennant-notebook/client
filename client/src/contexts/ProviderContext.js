import { HocuspocusProvider } from '@hocuspocus/provider';
import { createContext, useContext } from 'react';

export const initializeProvider = (docID, username) => {
  // const awsContainerURl = `${import.meta.env.VITE_ALB_DNS}/${docID}`;
  const provider = new HocuspocusProvider({
    url: import.meta.env.VITE_WEBSOCKET_SERVER,
    name: docID,
    token: import.meta.env.VITE_HP_ACCESS_TOKEN
  });

  const doc = provider.document;

  const notebookMetadata = doc.getMap('metaData');

  provider.on('synced', () => {
    console.log('🔮 PROVIDER SYNCED 🔮 ');
    if (provider.document.get('metaData').get('executionCount') === undefined) {
      notebookMetadata.set('executionCount', 0);
    }
  });

  const contextValue = {
    notebookMetadata,
    user: username.slice(1),
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
