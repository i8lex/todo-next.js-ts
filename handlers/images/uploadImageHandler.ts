import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Fields, Files } from 'formidable';
import * as jwt from "jsonwebtoken";
import fs from 'fs';
import { v4 as uuidv4 } from "uuid";
import path from 'path';
import sharp from 'sharp';
import mongoose from 'mongoose';
import { promisify } from 'util';

import { ImageModel } from '../../lib/models/imageModel';
import { ThumbModel } from '../../lib/models/thumbModel';
import { UserModel } from '../../lib/models/userModel';
import { Task } from '../../lib/models/taskModel';

const form = formidable({ multiples: true });

export const config = {
    api: {
        bodyParser: false,
    },
};

export const uploadImageHandler = async (request: NextApiRequest, response: NextApiResponse) => {
    try {
        const { verify } = jwt;
        const authHeader = request.headers.authorization;
        const token = authHeader ? authHeader.split(' ')[1] : null;
        const { id, email } = await verify(token as string, process.env.SECRET_WORD as string);


        const parseForm = promisify(form.parse.bind(form));
        const { fields, files } = await parseForm(request);

        const { task } = fields;
        const { images: fileArray } = files;

        console.log(task)
        console.log(fileArray)


        const imagePath = `./uploads/${id}/orig/`;
        if (!fs.existsSync(imagePath)) {
            fs.mkdirSync(imagePath, { recursive: true });
        }

        const thumbPath = `./uploads/${id}/thumb/`;
        if (!fs.existsSync(thumbPath)) {
            fs.mkdirSync(thumbPath, { recursive: true });
        }

        const images = await Task.findOne({ _id: task }).populate('images');

        for (const file of fileArray) {
            const mimetype = file.type.replace(/^.+\//, '.');
            const imageSaveTo = path.join(
                imagePath,
                `${email}_${uuidv4()}${mimetype}`
            );
            const thumbSaveTo = path.join(
                thumbPath,
                `${email}_${uuidv4()}_thumb${mimetype}`
            );

            const thumbBuffer = await sharp(file.path)
                .resize(100, 100, { fit: 'cover' })
                .toBuffer();

            fs.writeFileSync(imageSaveTo, fs.readFileSync(file.path));
            fs.writeFileSync(thumbSaveTo, thumbBuffer);

            const addImage = new ImageModel({
                user: id,
                task: task,
                filename: file.name,
                mimetype: file.type,
                size: file.size,
                image: fs.readFileSync(file.path),
                path: imageSaveTo,
            });

            const addThumb = new ThumbModel({
                user: id,
                task: task,
                image: addImage._id,
                filename: file.name,
                size: thumbBuffer.length,
                thumb: thumbBuffer,
                mimetype: file.type,
                thumbPath: thumbSaveTo,
            });

            await addImage.save();
            await addThumb.save();

            await ImageModel.updateOne({ _id: addImage._id }, { $set: { thumb: addThumb._id } });

            images.push(addImage);
        }

        await Task.updateOne({ _id: task }, { $set: { images: images } });

        response.send({ message: 'Images uploaded successfully' });
    } catch (error) {
        response.send({ message: 'Upload error' });
    }
};
