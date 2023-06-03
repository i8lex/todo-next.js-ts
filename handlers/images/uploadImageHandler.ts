import * as jwt from "jsonwebtoken";
// import { v4 as uuidv4 } from "uuid";
// import fs from "fs";
// import path from "path";
import sharp from "sharp";
import { Task, TaskType } from "@/lib/models/taskModel";
import { Image } from "@/lib/models/imageModel";
import { Thumb } from "@/lib/models/thumbModel";
import multer from "multer";
import { Request, Response } from "express";

const upload = multer({
  // dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadImageHandler = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const { verify } = jwt.default;
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(" ")[1] : null;
    const { id, email } = await verify(token, process.env.SECRET_WORD);

    upload.array("images")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: "Error uploading files" });
      }
      const task = req.body.task as string;
      const taskData: TaskType | null = await Task.findOne({ _id: task });
      if (!taskData) {
        return res.status(404).send({ message: "Task not found" });
      }
      const { images: imagesList } = taskData;
      const images = req.files as Express.Multer.File[];

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
        const mimeType = image.mimetype.replace(/^.+\//, ".");
        const thumbBuffer: Buffer = await sharp(image.buffer)
          .resize(100, 100, { fit: "cover" })
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
          task: task,
          filename: image.originalname,
          mimetype: mimeType,
          size: image.buffer.length,
          image: image.buffer,
          // path: imageSaveTo,
        });

        const addThumb = new Thumb({
          user: id,
          task: task,
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
          { $set: { thumb: addThumb._id } }
        );

        imagesList.push(addImage._id);
      }

      await Task.updateOne({ _id: task }, { $set: { images: imagesList } });
      console.log("success");
      res.status(200).json({ message: "Files upload successful" });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
