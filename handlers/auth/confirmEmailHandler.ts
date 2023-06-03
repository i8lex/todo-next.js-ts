import { User } from "@/lib/models/userModel";

import * as jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export const confirmEmailHandler = async (
  request: NextApiRequest,
  reply: NextApiResponse
) => {
  // @ts-ignore
  const { verify } = jwt.default;

  try {
    const { confirm } = request.query;
    const { email } = await verify(confirm, process.env.SECRET_WORD);
    const updateStatus = await User.updateOne(
      { email: email },
      { isconfirmed: true }
    );
    if (updateStatus.modifiedCount === 0) {
      return reply.status(404).send("User not found");
    } else {
      reply.send({
        message: "Successfully confirmed",
        email,
      });
    }
  } catch (error) {
    reply.status(401).send(error);
  }
};
