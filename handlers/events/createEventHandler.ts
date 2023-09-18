import * as jwt from 'jsonwebtoken';
import { Event } from '@/lib/models/eventModel';
import { NextApiRequest, NextApiResponse } from 'next';

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
  } catch (err) {
    console.log(err);
  }

  return reply
    .status(200)
    .send({ message: 'Event successful created', newEvent });
};
