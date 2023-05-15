import * as jwt from "jsonwebtoken";
import { Task } from "../../lib/models/taskModel";

export const createTaskHandler = async (request, reply) => {
    const { verify } = jwt.default;
    const { title, description, deadline, done } = request.body;
    const authHeader = request.headers.authorization;
    const token = authHeader ? authHeader.split(" ")[1] : null;
    const { id } = await verify(token, process.env.SECRET_WORD);
    const images = []

    const newTask = new Task({
        user: id,
        title: title,
        images: images,
        done: done,
        description: description,
        deadline: deadline,
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

