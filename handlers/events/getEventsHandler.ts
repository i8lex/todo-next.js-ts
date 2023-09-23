import * as jwt from 'jsonwebtoken';
import { Event } from '@/lib/models/eventModel';
import { NextApiRequest, NextApiResponse } from 'next';

export const getEventsHandler = async (
  request: NextApiRequest,
  reply: NextApiResponse,
) => {
  // @ts-ignore
  const { verify } = jwt.default;
  try {
    const authHeader = request.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : null;
    const { id } = await verify(token, process.env.SECRET_WORD);
    const { query } = request;

    let events;
    if (Object.keys(query).length === 0) {
      events = await Event.find({ user: id });
    } else {
      events = await Event.find({ ...query, user: id });
    }

    reply.send(events);
  } catch (err) {
    reply.status(500).send(err);
  }
};
