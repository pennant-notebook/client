import { HocuspocusProvider } from "@hocuspocus/provider";
import { createContext, useContext } from "react";

export const ProviderContext = createContext();

const useProviderContext = () => useContext(ProviderContext);

export default useProviderContext;

const roomToProviderMap = new Map();
const roomToDocMap = new Map();

export const initializeProvider = roomID => {
  console.log("token value is", import.meta.env.VITE_HP_ACCESS_TOKEN);
  let provider = roomToProviderMap.get(roomID);
  if (!provider) {
    provider = new HocuspocusProvider({
      url: import.meta.env.VITE_WEBSOCKET_SERVER,
      name: roomID,
      token: import.meta.env.VITE_HP_ACCESS_TOKEN
    });
    roomToProviderMap.set(roomID, provider);
  }

  let doc = roomToDocMap.get(roomID);
  if (!doc) {
    doc = provider.document;
    roomToDocMap.set(roomID, doc);
  }

  const notebookMetadata = doc.getMap("metaData");
  const cellsArray = doc.getArray("cells");

  provider.on("synced", () => {
    // console.log(notebookMetadata.get('executionCount'), 'exe count at sync');
    if (provider.document.get("metaData").get("executionCount") === undefined) {
      notebookMetadata.set("executionCount", 0);
    }
  });

  const contextValue = {
    notebookMetadata,
    doc,
    provider,
    awareness: provider.awareness
  };

  return contextValue;
};
