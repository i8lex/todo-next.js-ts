import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';

import { getImageHandler } from '@/handlers/images/getImageHandler';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { uploadImageHandler } from '@/handlers/images/uploadImageHandler';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default authMiddleware(async function imageHandlers(
  request: NextApiRequest,
  reply: NextApiResponse,
) {
  await db();

  const { method } = request;

  switch (method) {
    case 'GET':
      await getImageHandler(request, reply);
      break;

    case 'POST':
      // @ts-ignore
      await uploadImageHandler(request, reply);
      break;

    case 'PUT':
      // ...
      break;

    case 'DELETE':
      break;

    default:
      reply.status(405).end();
      break;
  }
});
