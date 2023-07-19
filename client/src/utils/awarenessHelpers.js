import * as awarenessProtocol from 'y-protocols/awareness.js';
import { getUserObjects } from './notebookHelpers';

export const updateClients = provider => {
  if (provider) {
    const clientId = provider.document.clientID;
    awarenessProtocol.removeAwarenessStates(provider.awareness, [clientId], 'user navigation');
    const currentStates = provider.awareness.getStates();
    provider.disconnect();
    console.log(Array.from(currentStates).length);
    return getUserObjects(currentStates);
  }
};

// export const createStateFieldForClient = () => {
//   awarenessProtocol.a
// }
