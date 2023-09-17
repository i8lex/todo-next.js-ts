import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import { loginHandler } from '@/handlers/auth/loginHandler';
// import cors from 'cors';
// import { createRouter, expressWrapper } from 'next-connect';
//
// const authHandlers = createRouter<NextApiRequest, NextApiResponse>();
// const corsOptions = {
//   origin: 'http://localhost', // Замените на разрешенный домен
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true, // Если вам нужно поддерживать куки и аутентификацию
// };
// authHandlers.use(async (request, event, next) => {
//   console.log(`${request.method} ${request.url}`);
//   return next();
// });
// authHandlers.use(cors(corsOptions));
// authHandlers.post(async (req, res) => {
//   console.log(req, res);
//   await loginHandler(req, res);
// });
//
// export default authHandlers;

export default async function authHandlers(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  await db();

  switch (method) {
    case 'GET':
      break;

    case 'POST':
      try {
        await loginHandler(req, res);
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
      }
      break;

    case 'PUT':
      // ...
      break;

    case 'DELETE':
      // ...
      break;

    default:
      res.status(405).end();
      break;
  }
}
