import * as jwt from 'jsonwebtoken';
import pkg from 'bcryptjs';
import { User } from '@/lib/models/userModel';
import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export const loginHandler = async (
  request: NextApiRequest,
  reply: NextApiResponse,
) => {
  const { compare } = pkg;
  const { sign } = jwt;

  const { email, password } = request.body;

  const user = await User.findOne({ email });
  if (!user) {
    return reply.status(401).send({ error: 'Wrong email or password' });
  } else {
    const isPasswordCorrect = await compare(password, user.password);
    if (isPasswordCorrect) {
      if (!user.isConfirmed) {
        return reply.status(401).send({
          error: "Please activate you're account",
          confirmed: user.isConfirmed,
        });
      } else {
        const token = sign(
          { email: user.email, id: user.id },
          process.env.SECRET_WORD as string,
          {
            expiresIn: '24h',
          },
        );
        return reply.status(200).send({
          id: user.id,
          message: `Welcome ${user.name}`,
          confirmed: user.isConfirmed,
          token: token,
        });
        // .setCookie("my-cookie", "cookie-value", {
        //   path: "/",
        //   // httpOnly: true,
        //   // secure: true,
        //   // sameSite: 'strict',
        //   maxAge: 60 * 60 * 24,
        // });
      }
    }
  }

  return reply.status(401).send({ error: 'Wrong email or password' });
};
