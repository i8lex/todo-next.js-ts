import { User } from '@/lib/models/userModel';
import { transporter } from '@/config';
import * as jwt from 'jsonwebtoken';
import Handlebars from 'handlebars';
import { NextApiRequest, NextApiResponse } from 'next';

export const repeatConfirmEmailHandler = async (
  request: NextApiRequest,
  reply: NextApiResponse,
) => {
  // @ts-ignore
  const { sign } = jwt.default;
  const { email } = request.body;

  const token = await sign({ email }, process.env.SECRET_WORD, {
    expiresIn: '15m',
  });

  const source = `<a href="{{url}}">Click to confirm</a>`;
  const template = Handlebars.compile(source);

  try {
    const data = { url: `${process.env.URL}/email/?confirm=${token}` };
    const html = template(data);

    await transporter.sendMail({
      from: 'noreply-authtodomail@gmail.com',
      to: email,
      subject: 'Todo register',
      html: html,
    });
  } catch (error) {
    reply.send({ error: error });
  }
  try {
    const updateStatus = await User.updateOne(
      { email: email },
      { confirmationCode: token },
    );

    if (updateStatus.modifiedCount === 0) {
      return reply.status(404).send('User not found');
    }
  } catch (err) {
    reply.status(500).send(err);
  }
  reply.send({
    message: 'Successfully send',
    email,
  });
};
