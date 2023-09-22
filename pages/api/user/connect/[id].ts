import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../../lib/db';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { getUserHandler } from '@/handlers/user/getUserHandler';
import { addConnectHandler } from '@/handlers/user/addConnectHandler';
import { deleteConnectHandler } from '@/handlers/user/deleteConnectHandler';
export default authMiddleware(async function userHandlers(
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
        await addConnectHandler(req, res);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
      }
      break;

    case 'PUT':
      break;
    case 'PATH':
      break;
    case 'DELETE':
      try {
        await deleteConnectHandler(req, res);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
      }

      break;

    default:
      res.status(405).end();
      break;
  }
});
