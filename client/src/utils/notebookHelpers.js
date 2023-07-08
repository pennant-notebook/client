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
  if (type === 'code') {
    cell.set('editorContent', new Y.Text(''));
    cell.set('outputMap', new Y.Map());
  } else {
    const xmlFragment = new Y.XmlFragment();
    const paragraph = new Y.XmlElement('paragraph');
    const text = new Y.XmlText('Hello World');
    paragraph.insert(0, [text]);
    xmlFragment.insert(0, [paragraph]);
    cell.set('xmlFragment', xmlFragment);
  }
  return cell;
};
