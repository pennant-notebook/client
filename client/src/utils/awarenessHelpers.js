import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

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
      name: item[1].user.name,
      color: item[1].user.color
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
