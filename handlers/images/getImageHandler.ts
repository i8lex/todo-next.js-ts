import * as jwt from "jsonwebtoken";
// import fs from 'fs';
import { Image } from "../../lib/models/imageModel";

const { verify } = jwt.default;

export const getImageHandler = async (request, reply) => {
  const authHeader = request.headers.authorization;
  const token = authHeader ? authHeader.split(" ")[1] : null;
  const { id } = await verify(token, process.env.SECRET_WORD);
  const { id: imageId } = request.query;
  try {
    const image = await Image.findOne({ _id: imageId, user: id });

    if (!image) {
      return reply.code(404).send({ message: "Image not found" });
    }

    // const data = fs.readFileSync(image.path); //
    // console.log(data)                         // upload from server
    // reply.type(image.mimetype).send(data);    //

    // const { image: data, mimetype, filename } = image;
    // console.log(Buffer.from(data));
    // reply.header("Content-Type", mimetype);
    // reply.header("Content-Disposition", `attachment; filename=${filename}`);
    // reply.send(Buffer.from(data.buffer));
    reply.send(image);
  } catch (err) {
    reply.code(500).send({ message: "Server error" });
  }
};
