import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { updateUserHandler } from '@/handlers/user/updateUserHandler';
import { getUserHandler } from '@/handlers/user/getUserHandler';

export default authMiddleware(async function userHandlers(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  await db();

  switch (method) {
    case 'GET':
      try {
        await getUserHandler(req, res);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
      }
      break;

    case 'POST':
      try {
        await updateUserHandler(req, res);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
      }

      break;

    case 'PUT':
      // ...
      break;
    case 'PATH':
      break;
    case 'DELETE':
      // ...
      break;

    default:
      res.status(405).end();
      break;
  }
});
