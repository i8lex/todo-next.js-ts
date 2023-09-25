import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  /* options, if needed */
});

httpServer.listen(3000, () => {
  console.log('WebSocket server is running on port 3001');
});

export { httpServer, io };
