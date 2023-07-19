import * as Y from 'yjs';
import { v4 as uuidv4 } from 'uuid';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

export const createContent = (type, defaultText = ' ') => {
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
    metadata.set('isActive', 'true');
  } else {
    cell.set('theme', new Y.Text('light'));
  }
  return cell;
};

export const yPrettyPrint = (ydoc, msg = '') => {
  console.log('\n\n==> ' + msg + ': \n' + JSON.stringify(ydoc.toJSON(), null, 4) + '\n\n');
};

export const slugify = title => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^\-|\-$/g, '');
};

export const promptForName = () => {
  const clientName = prompt('Please enter your name, under 10 characters');
  return clientName;
};

export const generateRandomName = () => {
  return uniqueNamesGenerator({ dictionaries: [animals], length: 1 });
};

export const getUserObjects = states => {
  return Array.from(states)
    .filter(([, state]) => state.user !== null)
    .map(item => ({
      id: item[0],
      name: item[1].user?.name,
      color: item[1].user?.color
    }));
};

export function randomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
