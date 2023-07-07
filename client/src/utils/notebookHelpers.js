import * as Y from "yjs";
import { v4 as uuidv4 } from "uuid";
import { HocuspocusProvider } from "@hocuspocus/provider";

export const initializeProvider = roomID => {
  const provider = new HocuspocusProvider({
    url: import.meta.env.VITE_WEBSOCKET_SERVER,
    name: roomID
  });

  const notebookMetadata = provider.document.getMap("metaData");
  const cellsArray = provider.document.getArray("cells");
  const notebookExecutionCount = notebookMetadata.get("executionCount");
  const awareness = provider.awareness;

  provider.on("synced", () => {
    if (notebookExecutionCount === undefined) {
      notebookMetadata.set("executionCount", 0);
    }
  });

  const contextValue = {
    roomID,
    awareness,
    notebookMetadata,
    notebookExecutionCount,
    cellsArray,
    doc: provider.document,
    provider
  };

  return [provider, contextValue];
};

export const createCell = type => {
  const cell = new Y.Map();
  cell.set("id", uuidv4());
  cell.set("type", type);
  cell.set("editorContent", new Y.Text(""));
  if (type === "code") {
    const outputMap = cell.set("outputMap", new Y.Map());
  }

  const _metaMap = new Y.Map();
  _metaMap.set("exeCount", 0);
  cell.set("metaData", _metaMap);

  return cell;
};
