import * as jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@/lib/models/user.model';

export const addConnectHandler = async (
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
    const user = await User.findById(userId);
    if (user) {
      user.connects.push(id);
      await user.save();
    }
    reply.send({ message: 'Request successfully sent' });
  } catch (err) {
    reply.status(500).send(err);
  }
};
