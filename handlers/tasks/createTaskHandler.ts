import * as jwt from "jsonwebtoken";
import { Task } from "@/lib/models/taskModel";
import { NextApiRequest, NextApiResponse } from "next";

export const createTaskHandler = async (
  request: NextApiRequest,
  reply: NextApiResponse
) => {
  // @ts-ignore
  const { verify } = jwt.default;
  const { title, description } = request.body;
  const authHeader = request.headers.authorization;
  const token = authHeader ? authHeader.split(" ")[1] : null;
  const { id } = await verify(token, process.env.SECRET_WORD);

  const newTask = new Task({
    user: id,
    title: title,
    description: description,
  });

  try {
    await newTask.save();
  } catch (err) {
    console.log(err);
  }

  return reply
    .status(200)
    .send({ message: "Task successful created", newTask });
};
