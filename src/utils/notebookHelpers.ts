import * as Y from 'yjs';
import { v4 as uuidv4 } from 'uuid';
import { uniqueNamesGenerator, animals } from 'unique-names-generator';
import { AwarenessUserState } from '@/ClientTypes';
import { getRandomColor } from './awarenessHelpers';

export const createContent = (type: string) => {
  if (type === 'code') return new Y.Text('');
  const xmlFragment = new Y.XmlFragment();
  const paragraph = new Y.XmlElement('paragraph');
  paragraph.setAttribute('data-block-id', 'turtle');
  const text = new Y.XmlText(' ');
  paragraph.insert(0, [text]);
  xmlFragment.insert(0, [paragraph]);
  return xmlFragment;
};

export const createCell = (type: string, lang: string) => {
  const cell = new Y.Map();
  cell.set('id', uuidv4());
  cell.set('type', type);
  cell.set('content', createContent(type));
  if (type === 'code') {
    cell.set('outputMap', new Y.Map());
    cell.set('language', lang)
    const metadata = cell.set('metaData', new Y.Map());
    metadata.set('isRunning', false);
    metadata.set('exeCount', 0);
  } else {
    cell.set('language', lang)
  }
  return cell;
};

export const yPrettyPrint = (ydoc: Y.Doc, msg = '') => {
  console.log('\n\n==> ' + msg + ': \n' + JSON.stringify(ydoc.toJSON(), null, 4) + '\n\n');
};

export const generateRandomName = () => {
  return uniqueNamesGenerator({ dictionaries: [animals], length: 1 });
};

export const getUserObjects = (states: Map<number, AwarenessUserState>) => {
  const userObjects = Array.from(states)
    .filter(([, state]) => state.user !== null)
    .map(item => ({
      user: {
        id: item[0],
        name: item[1].user?.name || "anonymous",
        color: item[1].user?.color || getRandomColor(),
        avatar_url: item[1].user?.avatar_url || '',
        avatar: item[1].user?.avatar || '',
      }
    }));

  return userObjects;
};

export const randomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const codeTestingPromise = async () => {
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve('Success!');
    }, 2000);
  });
  return promise;
};
