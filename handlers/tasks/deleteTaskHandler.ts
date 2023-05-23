import * as jwt from "jsonwebtoken";
import { Task } from "../../lib/models/taskModel";
import { Image } from "../../lib/models/imageModel";
import { Thumb } from "../../lib/models/thumbModel";

export const deleteTaskHandler = async (request, reply) => {
  const { verify } = jwt.default;
  const authHeader = request.headers.authorization;
  const token = authHeader ? authHeader.split(" ")[1] : null;
  const { userId } = await verify(token, process.env.SECRET_WORD);
  const { id: ids } = request.query;
  try {
    if (Object.keys(ids.split(",")).length === 0) {
      const tasks = await Task.find({ user: userId });
      reply.send(tasks);
    }

    const deletedTasks = await Task.deleteMany({
      _id: { $in: ids.split(",") },
    });

    const deletedImages = await Image.deleteMany({
      task: { $in: ids.split(",") },
    });

    const deletedThumbs = await Thumb.deleteMany({
      task: { $in: ids.split(",") },
    });

    if (deletedImages.deletedCount === 0) {
      console.log("Nothing");
    }
    if (deletedThumbs.deletedCount === 0) {
      console.log("Nothing");
    }

    if (deletedTasks.deletedCount === 0) {
      return reply.status(404).send("Task not found");
    }

    reply.send(deletedTasks);
  } catch (err) {
    reply.status(500).send(err);
  }
};
