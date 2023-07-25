import * as awarenessProtocol from 'y-protocols/awareness.js';
import { generateRandomName, getUserObjects, randomColor } from './notebookHelpers';

export const updateDisconnectedClient = provider => {
  if (provider) {
    const clientId = provider.document.clientID;
    awarenessProtocol.removeAwarenessStates(provider.awareness, [clientId], 'user navigation');
    const currentStates = provider.awareness.getStates();
    provider.disconnect();
    // console.log(Array.from(currentStates).length);
    return getUserObjects(currentStates);
  }
};

export const resetClients = provider => {
  if (provider) {
    const allClientIds = Array.from(provider.awareness.getStates().keys());
    console.log(allClientIds);
    awarenessProtocol.removeAwarenessStates(provider.awareness, allClientIds, 'reset by server');
  }
};

export const getCurrentClient = provider => {
  const clientId = provider.document.clientID;
  const current = provider.awareness.getStates().get(clientId);
  return current;
};

export const getClientFromLocalStorage = () => {
  let color, name;

  const storedUserData = JSON.parse(localStorage.getItem('userData'));

  if (storedUserData && storedUserData.setByUser) {
    color = storedUserData.color;
    name = storedUserData.name;
  } else {
    color = randomColor();
    name = generateRandomName();
    localStorage.setItem('userData', JSON.stringify({ name, color }));
  }
  return { name, color };
};
