import randomColor from 'randomcolor';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';

export const initializeYDoc = () => {
  const ydoc = new Y.Doc();
  const cells = ydoc.getArray('cells');
  console.log(cells);
  return ydoc;
};

export const initializeProvider = (ydoc, roomID) => {
  const provider = new WebrtcProvider(roomID, ydoc, { signaling: [import.meta.env.VITE_BACKEND_URL] });
  return provider;
};

export const createUser = () => {
  const username = prompt('Please enter your name, under 10 characters');
  const color = randomColor();
  const name =
    !username || username.trim() === '' || username.trim() === '\u200B'
      ? `${Math.floor(Math.random() * 10)}User`
      : username.trim().slice(0, 10);

  return { name, color };
};

export const updateUsers = jsonData => {
  var clientsArr = jsonData.map(item => ({
    clientId: item[0],
    name: item[1].user.name,
    color: item[1].user.color
    //////
  }));

  clientsArr.forEach(client => {
    const selectionClass = `yRemoteSelection-${client.clientId}`;
    const selectionHeadClass = `yRemoteSelectionHead-${client.clientId}`;

    const red = parseInt(client.color.substring(1, 3), 16);
    const green = parseInt(client.color.substring(3, 5), 16);
    const blue = parseInt(client.color.substring(5, 7), 16);

    const selectionStyle = document.createElement('style');
    selectionStyle.innerHTML = `
                    .${selectionClass} {
                        background-color: rgba(${red}, ${green}, ${blue}, 0.70);
                        border-radius: 2px
                    }

                    .${selectionHeadClass} {
                        z-index: 1;
                        position: absolute;
                        border-left: ${client.color} solid 2px;
                        border-top: ${client.color} solid 2px;
                        border-bottom: ${client.color} solid 2px;
                        height: 100%;
                        box-sizing: border-box;
                    }

                    .${selectionHeadClass}::after {
                        position: absolute;
                        content: ' ';
                        border: 3px solid ${client.color};
                        border-radius: 4px;
                        left: -4px;
                        top: -5px;
                    }

                    .${selectionHeadClass}:hover::before {
                        content: '${client.name}';
                        position: absolute;
                        background-color: ${client.color};
                        color: black;
                        padding-right: 3px;
                        padding-left: 3px;
                        margin-top: -2px;
                        font-size: 12px;
                        border-top-right-radius: 4px;
                        border-bottom-right-radius: 4px;
                    }
                `;
    document.head.appendChild(selectionStyle);
  });
};
