import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import {uploadImageHandler} from "../../../handlers/images/uploadImageHandler";


export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function imageHandlers(req, res) {
    const { method } = req;


    switch (method) {

        case 'GET':

            break;

        case 'POST':
            try {

                // await db.connect()
                await uploadImageHandler(req, res);

            } catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal server error' });
            }
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
