const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 1234 });

wss.on('connection', ws => {
  ws.on('message', message => {
    // Broadcast any message received to all clients
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});
