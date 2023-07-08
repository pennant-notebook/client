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

const createContent = type => {
  if (type === 'code') return new Y.Text('');
  const xmlFragment = new Y.XmlFragment();
  const paragraph = new Y.XmlElement('paragraph');
  const text = new Y.XmlText('Hello World');
  paragraph.insert(0, [text]);
  xmlFragment.insert(0, [paragraph]);
  return xmlFragment;
};

export const createCell = type => {
  const cell = new Y.Map();
  cell.set('id', uuidv4());
  cell.set('type', type);
  cell.set('content', createContent(type));
  if (type === 'code') {
    cell.set('outputMap', new Y.Map());
  }
  console.log(`'id' field createCell: ${cell.get('id')}`);

  return cell;
};
