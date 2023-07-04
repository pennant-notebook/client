import * as Y from 'yjs';
import { v4 as uuidv4 } from 'uuid';
import { WebrtcProvider } from 'y-webrtc';
import { IndexeddbPersistence } from 'y-indexeddb';

export const initializeYDoc = roomID => {
  const ydoc = new Y.Doc();
  const persistence = new IndexeddbPersistence(`${roomID}`, ydoc);
  const cells = ydoc.getArray('cells');
  return ydoc;
};

export const initializeProvider = (ydoc, roomID) => {
  const provider = new WebrtcProvider(roomID, ydoc, { signaling: [import.meta.env.VITE_BACKEND_URL] });
  return provider;
};

export const createCell = type => {
  const cell = new Y.Map();
  cell.set('id', uuidv4());
  cell.set('type', type);
  cell.set('text', new Y.Text(''));
  if (type === 'code') {
    const outputMap = cell.set('outputMap', new Y.Map());
  }
  return cell;
};
