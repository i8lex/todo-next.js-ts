import * as jwt from 'jsonwebtoken';
import { Event } from '@/lib/models/event.model';
import { Image } from '@/lib/models/image.model';
import { Thumb } from '@/lib/models/thumb.model';
import { NextApiRequest, NextApiResponse } from 'next';

export const deleteEventHandler = async (
  request: NextApiRequest,
  reply: NextApiResponse,
) => {
  // @ts-ignore
  const { verify } = jwt.default;
  const authHeader = request.headers.authorization;
  const token = authHeader ? authHeader.split(' ')[1] : null;
  const { userId } = await verify(token, process.env.SECRET_WORD);
  const { id: ids } = request.query;
  try {
    if (typeof ids === 'string' && ids.split(',').length === 0) {
      const events = await Event.find({ user: userId });
      reply.send(events);
    }
    if (typeof ids === 'string') {
      const deletedEvents = await Event.deleteMany({
        _id: { $in: ids.split(',') },
      });

      await Image.deleteMany({
        task: { $in: ids.split(',') },
      });

      await Thumb.deleteMany({
        task: { $in: ids.split(',') },
      });

      // if (deletedImages.deletedCount === 0) {
      //   console.log("Nothing");
      // }
      // if (deletedThumbs.deletedCount === 0) {
      //   console.log("Nothing");
      // }

      if (deletedEvents.deletedCount === 0) {
        return reply.status(404).send('Event not found');
      }

      reply.send(deletedEvents);
    }
  } catch (err) {
    reply.status(500).send(err);
  }
};
