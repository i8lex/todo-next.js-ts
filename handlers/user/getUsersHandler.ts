import * as jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@/lib/models/user.model';
import { UserDTO } from '@/redux/api/user.api';
import { getAge } from '@/utils/getAge';
import { isConnectedUtil } from '@/utils/isConnectedUtil';

export const getUsersHandler = async (
  request: NextApiRequest,
  reply: NextApiResponse,
) => {
  // @ts-ignore
  const { verify } = jwt.default;
  const authHeader = request.headers.authorization;
  const token = authHeader ? authHeader.split(' ')[1] : null;
  const { id } = await verify(token, process.env.SECRET_WORD);
  try {
    const usersFromDB: UserDTO[] = await User.find({
      _id: { $ne: id },
      isConfirmed: true,
    });
    const currentUser = await User.findById(id);
    const users = usersFromDB.map((user) => {
      const isConnected = isConnectedUtil(user, currentUser);
      const userToResponse: UserDTO = {};
      userToResponse.isConnect = isConnectedUtil(user, currentUser);
      if (
        (user.isBirthdayShowing === 'true' ||
          (user.isBirthdayShowing === 'connect' && isConnected === 'true')) &&
        user.birthday
      ) {
        userToResponse.birthday = getAge(user.birthday);
      }
      if (
        (user.isAboutShowing === 'true' ||
          (user.isAboutShowing === 'connect' && isConnected === 'true')) &&
        user.about
      ) {
        userToResponse.about = user.about;
      }
      if (
        (user.isGenderShowing === 'true' ||
          (user.isGenderShowing === 'connect' && isConnected === 'true')) &&
        user.gender
      ) {
        userToResponse.gender = user.gender;
      }
      if (
        (user.isRoleShowing === 'true' ||
          (user.isRoleShowing === 'connect' && isConnected === 'true')) &&
        user.role
      ) {
        userToResponse.role = user.role;
      }
      if (
        (user.isCompanyShowing === 'true' ||
          (user.isCompanyShowing === 'connect' && isConnected === 'true')) &&
        user.company
      ) {
        userToResponse.company = user.company;
      }
      if (user.firstname) {
        userToResponse.firstname = user.firstname;
      }
      if (user.lastname) {
        userToResponse.lastname = user.lastname;
      }

      if (user.avatar) {
        userToResponse.avatar = user.avatar;
      }
      userToResponse._id = user._id;
      userToResponse.name = user.name;
      return userToResponse;
    });
    // console.log('user', User);
    // console.log(updates);

    reply.send(users);
  } catch (err) {
    reply.status(500).send(err);
  }
};
