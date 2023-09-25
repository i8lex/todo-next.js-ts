// import { io } from '@/server.mjs';
// import { Request, Response } from 'express';
//
// export const socketHandler = (req: Request, res: Response) => {
//   io.on('connection', (socket) => {
//     console.log('A user connected');
//
//     socket.on('chat message', (message) => {
//       io.emit('chat message', message);
//     });
//
//     socket.on('disconnect', () => {
//       console.log('A user disconnected');
//     });
//   });
// };
// export default socketHandler;
