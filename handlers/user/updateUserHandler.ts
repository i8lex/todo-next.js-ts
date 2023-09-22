import * as jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@/lib/models/user.model';

export const updateUserHandler = async (
  request: NextApiRequest,
  reply: NextApiResponse,
) => {
  // @ts-ignore
  const { verify } = jwt.default;
  const authHeader = request.headers.authorization;
  const token = authHeader ? authHeader.split(' ')[1] : null;
  const { id } = await verify(token, process.env.SECRET_WORD);
  const updates = request.body;
  try {
    const updatedUser = await User.updateOne({ _id: id }, { $set: updates });
    const user = await User.findOne({ _id: id });
    // console.log('user', User);
    // console.log(updates);
    if (updatedUser.modifiedCount === 0) {
      return reply.status(404).send('Event not found');
    }

    reply.send(updatedUser);
  } catch (err) {
    reply.status(500).send(err);
  }
};
