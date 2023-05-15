import * as jwt from "jsonwebtoken";
import { Task } from "../../lib/models/taskModel";



export const changeTaskHandler = async (request, reply) => {
    const { verify } = jwt.default;
    const authHeader = request.headers.authorization;
    const token = authHeader ? authHeader.split(" ")[1] : null;
    const { id } = await verify(token, process.env.SECRET_WORD);
    const { id: taskId } = request.params;
    const updates = request.body;
    try {
        const updatedTask = await Task.updateOne(
            { _id: taskId, user: id },
            { $set: updates }
        );

        if (updatedTask.nModified === 0) {
            return reply.status(404).send("Task not found");
        }

        reply.send(updatedTask);
    } catch (err) {
        reply.status(500).send(err);
    }
};
