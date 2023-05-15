import * as jwt from 'jsonwebtoken';
import { hashSync, compareSync } from 'bcryptjs';
import {Task} from "../../lib/models/taskModel"

export const getTaskHandler = async (req, res) => {
    const {verify} = jwt.default
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader ? authHeader.split(" ")[1] : null;
        const { id } = await verify(token, process.env.SECRET_WORD);
        const { query } = req;

        let tasks;
        if (Object.keys(query).length === 0) {
            tasks = await Task.find({ user: id });
        } else {
            tasks = await Task.find({ ...query, user: id });
        }

        res.send(tasks);
    } catch (err) {
        res.status(500).send(err);
    }
};
