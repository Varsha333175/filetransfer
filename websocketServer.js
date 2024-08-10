const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  ws.on('close', () => {
    clients.delete(ws);
  });
});

const broadcast = (data) => {
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  }
};

module.exports = { broadcast };
