import * as jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@/lib/models/user.model';
import { Request, Response } from 'express';
import multer from 'multer';
import { UserDTO } from '@/redux/api/user.api';

const upload = multer({
  // dest: "uploads/",
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});
export const updateUserHandler = async (request: Request, reply: Response) => {
  // @ts-ignore
  const { verify } = jwt.default;
  const authHeader = request.headers.authorization;
  const token = authHeader ? authHeader.split(' ')[1] : null;
  const { id } = await verify(token, process.env.SECRET_WORD);

  upload.single('image')(request, reply, async (err) => {
    try {
      const updates = request.body as UserDTO;

      const image = request.file as Express.Multer.File;

      if (image) {
        const avatar = {
          buffer: image.buffer,
          filename: image.filename,
          mimetype: image.mimetype,
        };
        const updatedUser = await User.updateOne(
          { _id: id },
          { $set: updates, avatar },
        );

        if (updatedUser.modifiedCount === 0) {
          return reply.status(404).send('Event not found');
        }
      } else {
        const updatedUser = await User.updateOne(
          { _id: id },
          { $set: updates },
        );

        if (updatedUser.modifiedCount === 0) {
          return reply.status(404).send('Event not found');
        }
      }

      reply.send({ message: 'User updated' });
    } catch (err) {
      console.log('err.message');
      reply.status(500).send(err);
    }
  });
};
