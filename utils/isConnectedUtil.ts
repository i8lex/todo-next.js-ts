import { UserDTO } from '@/redux/api/user.api';

export const isConnectedUtil = (user: UserDTO, currentUser: UserDTO) => {
  const userIsConnectedToCurrentUser = user.connects?.includes(
    currentUser?._id!,
  );
  const currentUserIsConnectedToUser = currentUser.connects?.includes(
    user?._id!,
  );

  if (userIsConnectedToCurrentUser && currentUserIsConnectedToUser) {
    return 'true';
  } else if (userIsConnectedToCurrentUser) {
    return 'request';
  } else if (currentUserIsConnectedToUser) {
    return 'response';
  } else {
    return 'false';
  }
};
