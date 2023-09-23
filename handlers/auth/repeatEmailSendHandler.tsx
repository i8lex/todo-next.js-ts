import { User } from '@/lib/models/userModel';
import { transporter } from '@/config';
import * as jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { render } from '@react-email/render';
import { ConfirmEmail } from '@/components/ConfirmEmail';

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

  try {
    const user = await User.findOne({ email });
    const url = `${process.env.BASE_URL}/email/?confirm=${token}`;

    const emailHtml = render(<ConfirmEmail url={url} name={user.name} />);
    await transporter.sendMail({
      from: 'noreply-authtodomail@gmail.com',
      to: email,
      subject: 'Events, confirm registration email',
      html: emailHtml,
    });
    const updateStatus = await User.updateOne(
      { email: email },
      { confirmationCode: token },
    );

    if (!updateStatus.modifiedCount) {
      return reply.status(404).send('User not found');
    }
    return reply.send({
      message: 'Successfully send',
      email,
    });
  } catch (error) {
    reply.send({ error: error });
  }
};
