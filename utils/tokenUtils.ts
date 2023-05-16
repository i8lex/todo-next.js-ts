import * as jwt from "jsonwebtoken";

export const verifyToken = (token: string): boolean => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_WORD);

    return true;
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
};
