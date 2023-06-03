import * as jwt from "jsonwebtoken";
import { Image } from "@/lib/models/imageModel";
import { Thumb } from "@/lib/models/thumbModel";
import { NextApiRequest, NextApiResponse } from "next";

export const deleteImagesHandler = async (
  request: NextApiRequest,
  reply: NextApiResponse
) => {
  // @ts-ignore
  const { verify } = jwt.default;
  const authHeader = request.headers.authorization;
  const token = authHeader ? authHeader.split(" ")[1] : null;
  const { userId } = await verify(token, process.env.SECRET_WORD);
  const { id: ids } = request.query;

  try {
    if (typeof ids === "string" && ids.split(",").length === 0) {
      const images = await Image.find({ user: userId });
      reply.send(images);
    }
    if (typeof ids === "string") {
      const deletedImages = await Image.deleteMany({
        _id: { $in: ids.split(",") },
      });
      await Thumb.deleteMany({
        image: { $in: ids.split(",") },
      });
      if (deletedImages.deletedCount === 0) {
        return reply.status(404).send("Images not found");
      }

      reply.send(deletedImages);
    }
  } catch (err) {
    reply.status(500).send(err);
  }
};
