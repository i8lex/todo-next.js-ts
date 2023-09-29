import { User } from '@/lib/models/user.model';
import { transporter } from '@/config';
import { NextApiRequest, NextApiResponse } from 'next';
import { render } from '@react-email/render';
import { ConfirmEmail } from '@/components/ConfirmEmail';

export const confirmEmailSendHandler = async (
  request: NextApiRequest,
  reply: NextApiResponse,
) => {
  const { email, token, name } = request.body;

  try {
    console.log(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/email/?confirm=${token}`,
    );
    const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/email/?confirm=${token}`;

    const emailHtml = render(<ConfirmEmail url={url} name={name} />);
    await transporter.sendMail({
      from: 'noreply-authtodomail@gmail.com',
      to: email,
      subject: 'Events, confirm registration email',
      html: emailHtml,
    });

    return reply.send({
      message: 'Successfully send',
      email,
    });
  } catch (error) {
    reply.send({ error: error });
  }
};
