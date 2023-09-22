import * as jwt from 'jsonwebtoken';
import { Event } from '@/lib/models/event.model';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@/lib/models/user.model';

export const createEventHandler = async (
  request: NextApiRequest,
  reply: NextApiResponse,
) => {
  // @ts-ignore
  const { verify } = jwt.default;
  const { title, description } = request.body;
  const authHeader = request.headers.authorization;
  const token = authHeader ? authHeader.split(' ')[1] : null;
  const { id } = await verify(token, process.env.SECRET_WORD);

  const newEvent = new Event({
    user: id,
    title: title,
    description: description,
  });

  try {
    await newEvent.save();
    const user = await User.findById(id);
    if (user) {
      user.events.push(newEvent._id);
      await user.save();
    }
  } catch (err) {
    return reply.status(400).send({ message: 'Error', err });
  }
  return reply
    .status(200)
    .send({ message: 'Event successful created', newEvent });
};
