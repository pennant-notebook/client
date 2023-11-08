import { AwarenessUserState, UserState } from '@/ClientTypes';
import { HocuspocusProviderConfig } from '@/ProviderTypes';
import { removeAwarenessStates } from 'y-protocols/awareness';
import { generateRandomName, getUserObjects, randomColor } from './notebookHelpers';

const colors = ['#958DF1', '#F98181', '#FBBC88', '#FAF594', '#70CFF8', '#94FADB', '#B9F18D'];

export const updateDisconnectedClient = async (provider: HocuspocusProviderConfig) => {
  if (provider) {
    const clientId = provider.document.clientID;
    const clientIdsToRemove = [clientId];

    removeAwarenessStates(provider.awareness, clientIdsToRemove, provider);
    const currentStates = provider.awareness.getStates() as Map<number, AwarenessUserState>;
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

export const getClientFromLocalStorage = (): { name: string; color: string; avatar_url?: string } | undefined => {
  const storedUserData = localStorage.getItem('pennantAuthData');
  if (storedUserData !== null) {
    try {
      const parsedUserData = JSON.parse(storedUserData);
      return parsedUserData;
    } catch (e) {
      console.error("Couldn't parse stored user data:", e);
    }
  }
};

export const createClientAndStoreInLocalStorage = (): { name: string; color: string; avatar_url?: string } => {
  const color = randomColor();
  const name = generateRandomName();

  localStorage.setItem('pennantAuthData', JSON.stringify({ name, color, setByUser: false }));
  return { name, color };
};


export const storeClientInLocalStorage = (newName: string, color?: string, avatar_url?: string): void => {
  const localUser = getClientFromLocalStorage();
  if (localUser) {
    const userData = {
      ...localUser,
      name: newName,
      setByUser: true
    };

    localStorage.setItem('pennantAuthData', JSON.stringify(userData));
  }
};



export const updateAwarenessState = (provider: HocuspocusProviderConfig, userData: UserState) => {
  provider.awareness.setLocalStateField('user', {
    id: userData.id,
    name: userData.name,
    color: userData.color,
    avatar_url: userData.avatar_url,
    avatar: userData.avatar
  });
};


export const getRandomElement = (list: any[]) => list[Math.floor(Math.random() * list.length)];

export const getRandomColor = () => getRandomElement(colors);
