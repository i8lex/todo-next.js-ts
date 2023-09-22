import { NextApiRequest, NextApiResponse } from 'next';
import * as jwt from 'jsonwebtoken';
import { User } from '@/lib/models/user.model';

export const deleteConnectHandler = async (
  request: NextApiRequest,
  reply: NextApiResponse,
) => {
  // @ts-ignore
  const { verify } = jwt.default;
  const authHeader = request.headers.authorization;
  const token = authHeader ? authHeader.split(' ')[1] : null;
  const { id } = await verify(token, process.env.SECRET_WORD);
  try {
    const userId = request.query.id;
    const currentUser = await User.findById(id);
    console.log(userId);
    const user = await User.findById(userId);
    if (user) {
      user.connects.pull(id);
      await user.save();
    }
    if (currentUser) {
      console.log('current');
      currentUser.connects.pull(userId);
      await currentUser.save();
    }
    reply.send({ message: 'Connection successfully removed' });
  } catch (err) {
    reply.status(500).send(err);
  }
};
