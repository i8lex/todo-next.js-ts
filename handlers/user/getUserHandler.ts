import * as jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@/lib/models/user.model';
import mongoose from 'mongoose';

export const getUserHandler = async (
  request: NextApiRequest,
  reply: NextApiResponse,
) => {
  // @ts-ignore
  const { verify } = jwt.default;
  const authHeader = request.headers.authorization;
  const token = authHeader ? authHeader.split(' ')[1] : null;
  const { id } = await verify(token, process.env.SECRET_WORD);
  try {
    const userFromDB = await User.findOne({ _id: id });
    const user = {
      name: userFromDB.name,
      firstname: userFromDB.firstname,
      lastname: userFromDB.lastname,
      birthday: userFromDB.birthday,
      isBirthdayShowing: userFromDB.isBirthdayShowing,
      gender: userFromDB.gender,
      isGenderShowing: userFromDB.isGenderShowing,
      company: userFromDB.company,
      isCompanyShowing: userFromDB.isCompanyShowing,
      role: userFromDB.role,
      isRoleShowing: userFromDB.isRoleShowing,
      about: userFromDB.about,
      isAboutShowing: userFromDB.isAboutShowing,
      events: userFromDB.events,
      createdChats: userFromDB.createdChats,
      chats: userFromDB.chats,
      isEventsShowing: userFromDB.isEventsShowing,
      tasks: userFromDB.tasks,
      microtasks: userFromDB.microtasks,
      connects: userFromDB.connects,
      isConnectsShowing: userFromDB.isConnectsShowing,
      avatar: userFromDB.avatar,
    };
    // console.log('user', User);
    // console.log(updates);

    reply.send(user);
  } catch (err) {
    reply.status(500).send(err);
  }
};
