import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import { confirmEmailHandler } from '@/handlers/auth/confirmEmailHandler';
import { repeatConfirmEmailHandler } from '@/handlers/auth/repeatEmailSendHandler';

export default async function authHandlers(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  await db();

  switch (method) {
    case 'GET':
      await confirmEmailHandler(req, res);
      break;

    case 'POST':
      try {
        await repeatConfirmEmailHandler(req, res);
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
