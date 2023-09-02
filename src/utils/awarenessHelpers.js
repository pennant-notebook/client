import { removeAwarenessStates } from 'y-protocols/awareness';
import { generateRandomName, getUserObjects, randomColor } from './notebookHelpers';

export const updateDisconnectedClient = provider => {
  if (provider) {
    const clientId = provider.document.clientID;
    const clientIdsToRemove = [clientId];

    removeAwarenessStates(provider.awareness, clientIdsToRemove, provider);
    const currentStates = provider.awareness.getStates();
    provider.disconnect();
    return getUserObjects(currentStates);
  }
};

export const getCurrentClient = provider => {
  const clientId = provider.document.clientID;
  const current = provider.awareness.getStates().get(clientId);
  return current;
};

export const createClientAndStoreInLocalStorage = () => {
  const color = randomColor();
  const name = generateRandomName();

  localStorage.setItem('userData', JSON.stringify({ name, color }));
  return { name, color };
};

export const getClientFromLocalStorage = () => {
  let color, name;

  const storedUserData = JSON.parse(localStorage.getItem('userData'));

  if (storedUserData && storedUserData.setByUser) {
    color = storedUserData.color;
    name = storedUserData.name;
    return { name, color };
  } else {
    const newClient = createClientAndStoreInLocalStorage();
    return newClient;
  }
};
