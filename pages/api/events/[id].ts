import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import { deleteEventHandler } from '@/handlers/events/deleteEventHandler';
import { changeEventHandler } from '@/handlers/events/changeEventHandler';
import { authMiddleware } from '@/middlewares/authMiddleware';

export default authMiddleware(async function tasksHandlers(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await db();
  const { method } = req;
  switch (method) {
    case 'GET':
      try {
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
      }
      break;

    case 'POST':
      try {
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
      }

      break;

    case 'PUT':
      try {
        await changeEventHandler(req, res);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
      }

      break;

    case 'DELETE':
      try {
        await deleteEventHandler(req, res);
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
