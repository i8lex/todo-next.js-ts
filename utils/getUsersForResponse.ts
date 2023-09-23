import { UserDTO } from '@/redux/api/user.api';
import { isConnectedUtil } from '@/utils/isConnectedUtil';
import { getAge } from '@/utils/getAge';

export const getUsersForResponse = (users: UserDTO[], currentUser: UserDTO) => {
  return users.map((user) => {
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
};
