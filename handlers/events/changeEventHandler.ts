import * as jwt from 'jsonwebtoken';
import { Event } from '@/lib/models/eventModel';
import { NextApiRequest, NextApiResponse } from 'next';

export const changeEventHandler = async (
  request: NextApiRequest,
  reply: NextApiResponse,
) => {
  // @ts-ignore
  const { verify } = jwt.default;
  const authHeader = request.headers.authorization;
  const token = authHeader ? authHeader.split(' ')[1] : null;
  const { id } = await verify(token, process.env.SECRET_WORD);

  const { id: eventId } = request.query;

  const updates = request.body;
  try {
    const updatedEvent = await Event.updateOne(
      { _id: eventId, user: id },
      { $set: updates },
    );

    if (updatedEvent.modifiedCount === 0) {
      return reply.status(404).send('Event not found');
    }

    reply.send(updatedEvent);
  } catch (err) {
    reply.status(500).send(err);
  }
};
