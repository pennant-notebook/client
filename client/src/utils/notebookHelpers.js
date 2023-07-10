import * as Y from 'yjs';
import { v4 as uuidv4 } from 'uuid';

export const createContent = (type, defaultText = 'Hello World') => {
  if (type === 'code') return new Y.Text('');
  const xmlFragment = new Y.XmlFragment();
  const paragraph = new Y.XmlElement('paragraph');
  const text = new Y.XmlText(defaultText);
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
    const metadata = cell.set('metaData', new Y.Map());
    metadata.set('exeCount', 0);
  }
  return cell;
};
