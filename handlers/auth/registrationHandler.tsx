import pkg from 'bcryptjs';
import { transporter } from '@/config';
import * as jwt from 'jsonwebtoken';
import { User } from '@/lib/models/user.model';
import { NextApiRequest, NextApiResponse } from 'next';
import * as process from 'process';
import { render } from '@react-email/render';
import { ConfirmEmail } from '@/components/ConfirmEmail';

export const postRegistrationHandler = async (
  request: NextApiRequest,
  reply: NextApiResponse,
) => {
  const { hash } = pkg;
  // @ts-ignore
  const { sign } = jwt.default;
  const { name, email, password } = request.body;

  const existingEmail = await User.findOne({ email });
  const existingName = await User.findOne({ name });

  if (existingName) {
    return reply.status(400).send({
      error: 'User with this name already exists',
      field: 'name',
    });
  }
  if (existingEmail) {
    return reply.status(400).send({
      error: 'User with this email already exists',
      field: 'email',
    });
  }
  if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(password)) {
    return reply.status(400).send({
      error:
        'Password must contain at least one lowercase letter, one uppercase letter, one number and must be at least 8 characters long',
      field: 'password',
    });
  }

  const hashedPassword = await hash(password, 10);

  const token = await sign({ email }, process.env.SECRET_WORD, {
    expiresIn: '15m',
  });

  try {
    const url = `${process.env.BASE_URL}/email/?confirm=${token}`;

    const emailHtml = render(<ConfirmEmail url={url} name={name} />);
    await transporter.sendMail({
      from: 'noreply-authtodomail@gmail.com',
      to: email,
      subject: 'Events, confirm registration email',
      html: emailHtml,
    });
  } catch (error) {
    reply.send({ error: error });
  }

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    confirmationCode: token,
  });

  await newUser.save();
  return reply.status(201).send({
    message: 'Registration successful',
    email,
  });
};
