import * as Y from 'yjs';
import { v4 as uuidv4 } from 'uuid';
import { uniqueNamesGenerator, animals } from 'unique-names-generator';
import { UserState } from '@/ClientTypes';

export type YDoc = Y.Doc;
export type YArray = Y.Array<any>;
export type YMap = Y.Map<any>;
export type YText = Y.Text;
export type YXmlElement = Y.XmlElement;
export type YXmlFragment = Y.XmlFragment;
export type YXmlText = Y.XmlText;

export type YMapEvent<T> = Y.YMapEvent<T>;

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

export const createCell = (type: string) => {
  const cell = new Y.Map();
  cell.set('id', uuidv4());
  cell.set('type', type);
  cell.set('content', createContent(type));
  if (type === 'code') {
    cell.set('outputMap', new Y.Map());
    const metadata = cell.set('metaData', new Y.Map());
    metadata.set('isRunning', false);
    metadata.set('exeCount', 0);
  }
  return cell;
};

export const yPrettyPrint = (ydoc: Y.Doc, msg = '') => {
  console.log('\n\n==> ' + msg + ': \n' + JSON.stringify(ydoc.toJSON(), null, 4) + '\n\n');
};


export const generateRandomName = () => {
  return uniqueNamesGenerator({ dictionaries: [animals], length: 1 });
};

export const getUserObjects = (states: Map<number, UserState>) => {
  return Array.from(states)
    .filter(([, state]) => state.user !== null)
    .map(item => ({
      id: item[0],
      name: item[1].user?.name,
      color: item[1].user?.color
    }));
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
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Success!');
    }, 2000);
  });
  return promise;
};
