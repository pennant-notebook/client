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
  // const notebookExecutionCount = notebookMetadata.get("executionCount");
  const awareness = provider.awareness;

  provider.on("synced", () => {
    console.log(notebookMetadata.get("executionCount"), "exe count at sync");
    if (provider.document.get("metaData").get("executionCount") === undefined) {
      notebookMetadata.set("executionCount", 0);
    }
  });

  const contextValue = {
    roomID,
    awareness,
    notebookMetadata,
    cellsArray,
    doc: provider.document,
    provider
  };

  return [provider, contextValue];
};

const createContent = type => {
  if (type === "code") return new Y.Text("");
  const xmlFragment = new Y.XmlFragment();
  const paragraph = new Y.XmlElement("paragraph");
  const text = new Y.XmlText("Hello World");
  paragraph.insert(0, [text]);
  xmlFragment.insert(0, [paragraph]);
  return xmlFragment;
};

export const createCell = type => {
  const cell = new Y.Map();
  cell.set("id", uuidv4());
  cell.set("type", type);
  cell.set("content", createContent(type));
  if (type === "code") {
    cell.set("outputMap", new Y.Map());
  }

  const _cellMetaDataMap = new Y.Map();
  _cellMetaDataMap.set("exeCount", 0);
  cell.set("metaData", _cellMetaDataMap);

  return cell;
};
