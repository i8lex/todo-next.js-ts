import { User } from '@/lib/models/userModel';

import * as jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

export const confirmEmailHandler = async (
  request: NextApiRequest,
  reply: NextApiResponse,
) => {
  // @ts-ignore
  const { verify } = jwt.default;

  try {
    const { confirm } = request.query;
    const { email } = await verify(confirm, process.env.SECRET_WORD);
    const user = await User.findOne({ email: email });
    console.log('user', user);
    if (confirm === user.confirmationCode) {
      const { modifiedCount } = await User.updateOne(
        { email: email },
        { isConfirmed: true },
      );
      console.log(
        '#24',
        confirm,
        email,
        modifiedCount,
        confirm === user.confirmationCode,
      );
      if (!modifiedCount) {
        return reply.status(404).send('Something go wrong');
      } else {
        reply.send({
          message: 'Successfully confirmed',
          email,
        });
      }
    } else {
      return reply.status(404).send('Something go wrong');
    }
  } catch (error) {
    reply.status(401).send(error);
  }
};
