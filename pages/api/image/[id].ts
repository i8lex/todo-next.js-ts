import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import { getThumbsHandler } from '@/handlers/images/getThumbsHandler';

import { deleteImagesHandler } from '@/handlers/images/deleteImagesHandler';
import { authMiddleware } from '@/middlewares/authMiddleware';

export default authMiddleware(async function imageHandlers(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await db();
  const { method } = req;

  switch (method) {
    case 'GET':
      await getThumbsHandler(req, res);
      break;

    case 'POST':
      // ...
      break;

    case 'PUT':
      // ...
      break;

    case 'DELETE':
      await deleteImagesHandler(req, res);
      break;

    default:
      res.status(405).end();
      break;
  }
});
