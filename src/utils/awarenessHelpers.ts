import { UserState } from '@/ClientTypes';
import { HocuspocusProviderConfig } from '@/ProviderTypes';
import { removeAwarenessStates } from 'y-protocols/awareness';
import { generateRandomName, getUserObjects, randomColor } from './notebookHelpers';

const colors = ['#958DF1', '#F98181', '#FBBC88', '#FAF594', '#70CFF8', '#94FADB', '#B9F18D'];

export const updateDisconnectedClient = async (provider: HocuspocusProviderConfig) => {
  if (provider) {
    const clientId = provider.document.clientID;
    const clientIdsToRemove = [clientId];

    removeAwarenessStates(provider.awareness, clientIdsToRemove, provider);
    const currentStates = provider.awareness.getStates() as Map<number, UserState>;
    provider.disconnect();
    return getUserObjects(currentStates);
  }
  return undefined;
};

export const getCurrentClient = (provider: HocuspocusProviderConfig): UserState | undefined => {
  const clientId = provider.document.clientID;
  const current = provider.awareness.getStates().get(clientId) as UserState;
  return current;
};

export const storeClientInLocalStorage = (name: string, color?: string): void => {
  const existingUserData = getClientFromLocalStorage();
  const userData = {
    name,
    color: color || existingUserData.color || randomColor(),
    setByUser: true
  };

  localStorage.setItem('userData', JSON.stringify(userData));
};


export const createClientAndStoreInLocalStorage = (): { name: string; color: string } => {
  const color = randomColor();
  const name = generateRandomName();

  localStorage.setItem('userData', JSON.stringify({ name, color }));
  return { name, color };
};

export const getClientFromLocalStorage = (): { name: string; color: string } => {
  const storedUserData = localStorage.getItem('userData');
  if (storedUserData !== null) {
    try {
      const parsedUserData = JSON.parse(storedUserData);
      if (parsedUserData.setByUser) {
        return { name: parsedUserData.name, color: parsedUserData.color };
      }
    } catch (e) {
      console.error("Couldn't parse stored user data:", e);
    }
  }

  return createClientAndStoreInLocalStorage();
};

export const getRandomElement = (list: any[]) => list[Math.floor(Math.random() * list.length)];

export const getRandomColor = () => getRandomElement(colors);
