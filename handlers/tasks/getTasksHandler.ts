import * as jwt from "jsonwebtoken";
import { Task } from "@/lib/models/taskModel";
import { NextApiRequest, NextApiResponse } from "next";

export const getTaskHandler = async (
  request: NextApiRequest,
  reply: NextApiResponse
) => {
  // @ts-ignore
  const { verify } = jwt.default;
  try {
    const authHeader = request.headers.authorization;
    const token = authHeader ? authHeader.split(" ")[1] : null;
    const { id } = await verify(token, process.env.SECRET_WORD);
    const { query } = request;

    let tasks;
    if (Object.keys(query).length === 0) {
      tasks = await Task.find({ user: id });
    } else {
      tasks = await Task.find({ ...query, user: id });
    }

    reply.send(tasks);
  } catch (err) {
    reply.status(500).send(err);
  }
};
