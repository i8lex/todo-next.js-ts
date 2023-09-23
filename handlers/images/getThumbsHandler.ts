import * as jwt from 'jsonwebtoken';
import { Thumb } from '@/lib/models/thumbModel';
import { NextApiRequest, NextApiResponse } from 'next';

export const getThumbsHandler = async (
  request: NextApiRequest,
  reply: NextApiResponse,
) => {
  // @ts-ignore
  const { verify } = jwt.default;
  const authHeader = request.headers.authorization;
  const token = authHeader ? authHeader.split(' ')[1] : null;
  const { id } = await verify(token, process.env.SECRET_WORD);
  const { id: eventId } = request.query;

  try {
    const images = await Thumb.find({ event: eventId, user: id });

    if (!images) {
      return reply.status(404).send({ message: 'Image not found' });
    }

    reply.send(images);
  } catch (err) {
    console.log(err);
    reply.status(500).send(err);
  }
};
