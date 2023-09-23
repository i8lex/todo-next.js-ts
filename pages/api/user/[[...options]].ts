import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { updateUserHandler } from '@/handlers/user/updateUserHandler';
import { getUserHandler } from '@/handlers/user/getUserHandler';
import { addConnectHandler } from '@/handlers/user/addConnectHandler';

export const config = {
  api: {
    bodyParser: false,
  },
};
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
        // @ts-ignore
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
      try {
        console.log('here');
        await addConnectHandler(req, res);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
      }
      break;
    case 'DELETE':
      // ...
      break;

    default:
      res.status(405).end();
      break;
  }
});
