import * as jwt from "jsonwebtoken";
// import fs from 'fs';
import { Image } from "@/lib/models/imageModel";
import { NextApiRequest, NextApiResponse } from "next";

export const getImageHandler = async (
  request: NextApiRequest,
  reply: NextApiResponse
) => {
  // @ts-ignore
  const { verify } = jwt.default;
  const authHeader = request.headers.authorization;
  const token = authHeader ? authHeader.split(" ")[1] : null;
  const { id } = await verify(token, process.env.SECRET_WORD);
  const { id: imageId } = request.query;
  try {
    const image = await Image.findOne({ _id: imageId, user: id });

    if (!image) {
      return reply.status(404).send({ message: "Image not found" });
    }

    reply.send(image);
  } catch (err) {
    reply.status(500).send({ message: "Server error" });
  }
};
