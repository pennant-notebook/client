import { AwarenessUserState, UserState } from '@/ClientTypes';
import { HocuspocusProviderConfig } from '@/ProviderTypes';
import { removeAwarenessStates } from 'y-protocols/awareness';
import { generateRandomName, getUserObjects } from './notebookHelpers';

type ColorMap = {
  [key: string]: string;
};

export const colorMap: ColorMap = {
  '#ff6600': '#ff9000', // Orange to Lighter Orange
  '#ffcc00': '#fff600', // Yellow to Light Yellow
  '#ccff00': '#a2ff00', // Yellow-Green to Green-Yellow
  '#47A906': '#47A906', // Light Green to Slightly Darker Green
  '#05C270': '#00ff90', // Aquamarine to Lighter Aquamarine
  '#06C1BA': '#00fff6', // Turquoise to Light Turquoise
  '#037CC2': '#00a2ff', // Sky Blue to Slightly Darker Sky Blue
  '#5871C1': '#5871C1', // Blue to Slightly Darker Blue
  '#2F74C4': '#2F74C4', // Pure Blue to Slightly Violet Blue
  '#6600ff': '#9100ff', // Indigo to Lighter Indigo
  '#cc00ff': '#f700ff', // Violet to Lighter Violet
  '#ff00cc': '#ff00a1', // Magenta to Lighter Magenta
  '#ff0066': '#ff003c'  // Pink to Slightly Darker Pink
};

const colors = Object.keys(colorMap);

export const getRandomElement = <T>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

export const getRandomColor = () => getRandomElement(colors);
export const getAnalogColor = (color: string) => colorMap[color];

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
  const color = getRandomColor();
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
      setByUser: true,
      color: color || localUser.color,
      avatar_url: avatar_url || localUser.avatar_url
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


