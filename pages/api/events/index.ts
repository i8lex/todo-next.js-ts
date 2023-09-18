import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import { getEventsHandler } from '@/handlers/events/getEventsHandler';
import { createEventHandler } from '@/handlers/events/createEventHandler';
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
        await getEventsHandler(req, res);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
      }
      break;

    case 'POST':
      try {
        await createEventHandler(req, res);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
      }

      break;

    case 'PUT':
      try {
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
      }

      break;

    case 'DELETE':
      try {
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
