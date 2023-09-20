import * as jwt from 'jsonwebtoken';
// import { v4 as uuidv4 } from "uuid";
// import fs from "fs";
// import path from "path";
import sharp from 'sharp';
import { Event, EventType } from '@/lib/models/eventModel';
import { Image } from '@/lib/models/imageModel';
import { Thumb } from '@/lib/models/thumbModel';
import multer from 'multer';
import { Request, Response } from 'express';

const upload = multer({
  // dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadImageHandler = async (request: Request, reply: Response) => {
  try {
    // @ts-ignore
    const { verify } = jwt.default;
    const authHeader = request.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : null;
    const { id } = await verify(token, process.env.SECRET_WORD);
    upload.array('images')(request, reply, async (err) => {
      if (err) {
        return reply.status(400).json({ error: 'Error uploading files' });
      }
      const event = request.body.event as string;

      const eventData: EventType | null = await Event.findOne({ _id: event });
      if (!eventData) {
        return reply.status(404).send({ message: 'Event not found' });
      }
      const { images: imagesList } = eventData;
      const images = request.files as Express.Multer.File[];

      // const uploadDir = "uploads";
      // const imagePath = path.join(uploadDir, id, "orig");
      // const thumbPath = path.join(uploadDir, id, "thumb");
      // if (!fs.existsSync(imagePath)) {
      //   fs.mkdirSync(imagePath, { recursive: true });
      // }
      // if (!fs.existsSync(thumbPath)) {
      //   fs.mkdirSync(thumbPath, { recursive: true });
      // }

      for (const image of images) {
        const mimeType = image.mimetype.replace(/^.+\//, '.');
        const thumbBuffer: Buffer = await sharp(image.buffer)
          .resize(100, 100, { fit: 'cover' })
          .toBuffer();

        // const imageSaveTo = path.join(
        //   imagePath,
        //   `${email}_${uuidv4()}${mimeType}`
        // );
        // const thumbSaveTo = path.join(
        //   thumbPath,
        //   `${email}_${uuidv4()}_thumb${mimeType}`
        // );
        // fs.writeFileSync(imageSaveTo, imageBuffer);
        // fs.writeFileSync(thumbSaveTo, thumbBuffer);

        const addImage = new Image({
          user: id,
          event: event,
          filename: image.originalname,
          mimetype: mimeType,
          size: image.buffer.length,
          image: image.buffer,
          // path: imageSaveTo,
        });

        const addThumb = new Thumb({
          user: id,
          event: event,
          image: addImage._id,
          filename: image.originalname,
          size: thumbBuffer.length,
          thumb: thumbBuffer,
          mimetype: mimeType,
          // thumbPath: thumbSaveTo,
        });
        await addImage.save();
        await addThumb.save();

        await Image.updateOne(
          { _id: addImage._id },
          { $set: { thumb: addThumb._id } },
        );

        imagesList.push(addImage._id);
      }

      await Event.updateOne({ _id: event }, { $set: { images: imagesList } });
      await reply.status(200).json({ message: 'Files upload successful' });
    });
  } catch (error) {
    return reply.status(500).json({ error: 'Internal server error' });
  }
};
