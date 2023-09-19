import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import { loginHandler } from '@/handlers/auth/loginHandler';

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
