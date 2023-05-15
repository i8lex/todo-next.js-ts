import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import {getTaskHandler} from "../../../handlers/tasks/getTasksHandler";

export default async function tasksHandlers(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;



    switch (method) {

        case 'GET':
            try {
                await db.connect();
                await getTaskHandler(req, res);
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal server error' });
            }
            break;

        case 'POST':
            // ...
            break;

        case 'PUT':
            // ...
            break;

        case 'DELETE':
            // ...
            break;

        default:
            res.status(405).end();
            break;
    }
}
