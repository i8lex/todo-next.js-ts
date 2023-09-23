import * as jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@/lib/models/user.model';
import { UserDTO } from '@/redux/api/user.api';
import { getUsersForResponse } from '@/utils/getUsersForResponse';

export const getConnectedUsersHandler = async (
  request: NextApiRequest,
  reply: NextApiResponse,
) => {
  // @ts-ignore
  const { verify } = jwt.default;
  const authHeader = request.headers.authorization;
  const token = authHeader ? authHeader.split(' ')[1] : null;
  const { id } = await verify(token, process.env.SECRET_WORD);
  try {
    const currentUser = await User.findById(id);
    const usersFromDB: UserDTO[] = await User.find({
      _id: { $ne: id },
      isConfirmed: true,
      $or: [{ _id: { $in: currentUser.connects } }, { connects: id }],
    });
    const users = getUsersForResponse(usersFromDB, currentUser);

    reply.send(users);
  } catch (err) {
    reply.status(500).send(err);
  }
};
