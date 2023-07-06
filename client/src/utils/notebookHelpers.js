import * as Y from 'yjs';
import { v4 as uuidv4 } from 'uuid';
import { HocuspocusProvider } from '@hocuspocus/provider';

export const initializeProvider = roomID => {
  const provider = new HocuspocusProvider({
    url: import.meta.env.VITE_WEBSOCKET_SERVER,
    name: roomID
  });
  return provider;
};

export const createCell = type => {
  const cell = new Y.Map();
  cell.set('id', uuidv4());
  cell.set('type', type);
  cell.set('editorContent', new Y.Text(''));
  if (type === 'code') {
    const outputMap = cell.set('outputMap', new Y.Map());
  }
  return cell;
};
