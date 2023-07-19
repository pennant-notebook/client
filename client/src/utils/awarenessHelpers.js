import * as awarenessProtocol from 'y-protocols/awareness.js';

export const updateClients = provider => {
  if (provider) {
    const clientId = provider.document.clientID;
    awarenessProtocol.removeAwarenessStates(provider.awareness, [clientId], 'user navigation');
    const currentStates = provider.awareness.getStates();
    provider.disconnect();
    return currentStates;
  }
};
