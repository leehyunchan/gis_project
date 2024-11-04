// server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', (ws) => {
   console.log('New client connected');
   
   setInterval(() => {
      const lat = 37.5665 + (Math.random() - 0.5) * 0.01;
      const lng = 126.9780 + (Math.random() - 0.5) * 0.01;
      ws.send(JSON.stringify({ latitude: lat, longitude: lng }));
   }, 2000);

   ws.on('close', () => console.log('Client disconnected'));
});
