import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';

export default async function registrationHandler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const conn = await db.connect();
                const data = await conn.collection('collection-name').find().toArray();
                res.status(200).json({ data });
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
