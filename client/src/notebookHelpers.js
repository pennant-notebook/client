import * as Y from "yjs";
import { v4 as uuidv4 } from "uuid";
import { WebsocketProvider } from "y-websocket";
import { ws } from "ws";

export const initializeYDoc = roomID => {
  const ydoc = new Y.Doc();
  const cells = ydoc.getArray("cells");
  return ydoc;
};

export const initializeProvider = (ydoc, roomID) => {
  const provider = new WebsocketProvider(
    import.meta.env.VITE_WEBSOCKET_SERVER,
    roomID,
    ydoc,
    { WebSocketPolyfill: ws }
  );
  return provider;
};

export const createCell = type => {
  const cell = new Y.Map();
  cell.set("id", uuidv4());
  cell.set("type", type);
  cell.set("editorContent", new Y.Text(""));
  if (type === "code") {
    const outputMap = cell.set("outputMap", new Y.Map());
  }
  return cell;
};
