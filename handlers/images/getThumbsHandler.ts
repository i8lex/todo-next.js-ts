import * as jwt from "jsonwebtoken";
// import fs from 'fs';
import { Thumb } from "../../lib/models/thumbModel";

const { verify } = jwt.default;

export const getThumbsHandler = async (request, reply) => {
  const authHeader = request.headers.authorization;
  const token = authHeader ? authHeader.split(" ")[1] : null;
  const { id } = await verify(token, process.env.SECRET_WORD);
  const { id: taskId }: string = request.query;
  console.log(taskId);

  try {
    const images = await Thumb.find({ task: taskId, user: id });

    // console.log(image.mimetype);
    // console.log(image.path);
    if (!images) {
      return reply.status(404).send({ message: "Image not found" });
    }

    // const data = fs.readFileSync(image.path); //
    // console.log(data)                         // upload from server
    // reply.type(image.mimetype).send(data);    //

    // const { data, mimetype } = image.file;
    // reply.header("Content-Type", mimetype);
    reply.send(images);
  } catch (err) {
    console.log(err);
    reply.status(500).send(err);
  }
};
