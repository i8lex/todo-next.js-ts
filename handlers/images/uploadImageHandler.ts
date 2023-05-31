import * as jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import mime from "mime-types";
import path from "path";
import sharp from "sharp";
import { Task, TaskType } from "@/lib/models/taskModel";
import { Image } from "@/lib/models/imageModel";
import { Thumb } from "@/lib/models/thumbModel";
import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024, // Ограничение размера файла в 5 МБ
  },
});

// export const uploadImageHandler = async (
//   req: NextApiRequest,
//   res: NextApiResponse
// ) => {
//   // @ts-ignore
//   const { verify } = jwt.default;
//   const authHeader = req.headers.authorization;
//   const token = authHeader ? authHeader.split(" ")[1] : null;
//   const { id, email } = await verify(token, process.env.SECRET_WORD);
//
//   await upload.array("images")(req, res, (err) => {
//     if (err) {
//       return res.status(400).json({ error: "Ошибка загрузки файла" });
//     }
//     const task = req.body.task as string; // Значение поля task из запроса
//
//     const taskData: TaskType | null = Task.findOne({ _id: task });
//     if (!taskData) {
//       return res.status(404).send({ message: "Task not found" });
//     }
//     const { images: imageArray } = taskData;
//     const imagePath = `./uploads/${id}/orig/`;
//     if (!fs.existsSync(imagePath)) {
//       fs.mkdirSync(imagePath, { recursive: true });
//     }
//     const thumbPath = `./uploads/${id}/thumb/`;
//     if (!fs.existsSync(thumbPath)) {
//       fs.mkdirSync(thumbPath, { recursive: true });
//     }
//     const files = req.files as Express.Multer.File[]; // Массив с загруженными файлами images
//     for (const image of files) {
//       console.log(image);
//       const { path: tempFile, originalname } = image;
//       const fullMimeType = mime.lookup(originalname) as string;
//       const mimeType: string = fullMimeType.replace(/^.+\//, ".");
//       const imageSaveTo = path.join(
//         imagePath,
//         `${email}_${uuidv4()}${mimeType}`
//       );
//       const thumbSaveTo = path.join(
//         thumbPath,
//         `${email}_${uuidv4()}_thumb${mimeType}`
//       );
//       const imageBuffer: Buffer = fs.readFileSync(tempFile);
//       const thumbBuffer: Buffer = sharp(imageBuffer)
//         .resize(100, 100, { fit: "cover" })
//         .toBuffer();
//
//       // fs.writeFileSync(imageSaveTo, imageBuffer);
//       // fs.writeFileSync(thumbSaveTo, thumbBuffer);
//
//       const addImage = new Image({
//         user: id,
//         task: task,
//         filename: originalname,
//         mimetype: mimeType,
//         size: imageBuffer.length,
//         image: imageBuffer,
//         path: imageSaveTo,
//       });
//
//       const addThumb = new Thumb({
//         user: id,
//         task: task,
//         image: addImage._id,
//         filename: originalname,
//         size: thumbBuffer.length,
//         thumb: thumbBuffer,
//         mimetype: mimeType,
//         thumbPath: thumbSaveTo,
//       });
//       addImage.save();
//       addThumb.save();
//
//       Image.updateOne({ _id: addImage._id }, { $set: { thumb: addThumb._id } });
//
//       imageArray.push(addImage._id);
//       fs.unlinkSync(tempFile);
//     }
//
//     Task.updateOne({ _id: task }, { $set: { images: imageArray } });
//     console.log(files);
//     console.log(task);
//
//     res.status(200).json({ message: "Файлы успешно загружены" });
//   });
// };

//
// const {images, task} = request.body
//
// const taskData: TaskType | null = await Task.findOne({ _id: task });
//     if (!taskData) {
//       return reply.status(404).send({ message: "Task not found" });
//     }
//     const { images: imageArray } = taskData;
//     const imagePath = `./uploads/${id}/orig/`;
//     if (!fs.existsSync(imagePath)) {
//       fs.mkdirSync(imagePath, { recursive: true });
//     }
//     const thumbPath = `./uploads/${id}/thumb/`;
//     if (!fs.existsSync(thumbPath)) {
//       fs.mkdirSync(thumbPath, { recursive: true });
//     }
//     for (const image of images) {
//       console.log(image)
//       const { path: tempFile, originalFilename } = image;
//       const fullMimeType = mime.lookup(originalFilename) as string;
//       const mimeType: string = fullMimeType.replace(/^.+\//, ".");
//       const imageSaveTo = path.join(
//         imagePath,
//         `${email}_${uuidv4()}${mimeType}`
//       );
//       const thumbSaveTo = path.join(
//         thumbPath,
//         `${email}_${uuidv4()}_thumb${mimeType}`
//       );
//       const imageBuffer: Buffer = fs.readFileSync(tempFile);
//       const thumbBuffer: Buffer = await sharp(imageBuffer)
//         .resize(100, 100, { fit: "cover" })
//         .toBuffer();
//
//       // fs.writeFileSync(imageSaveTo, imageBuffer);
//       // fs.writeFileSync(thumbSaveTo, thumbBuffer);
//
//       const addImage = new Image({
//         user: id,
//         task: task,
//         filename: originalFilename,
//         mimetype: mimeType,
//         size: imageBuffer.length,
//         image: imageBuffer,
//         path: imageSaveTo,
//       });
//
//       const addThumb = new Thumb({
//         user: id,
//         task: task,
//         image: addImage._id,
//         filename: originalFilename,
//         size: thumbBuffer.length,
//         thumb: thumbBuffer,
//         mimetype: mimeType,
//         thumbPath: thumbSaveTo,
//       });
//       await addImage.save();
//       await addThumb.save();
//
//       await Image.updateOne(
//         { _id: addImage._id },
//         { $set: { thumb: addThumb._id } }
//       );
//
//       imageArray.push(addImage._id);
//       fs.unlinkSync(tempFile);
//     }
//
//     await Task.updateOne({ _id: task }, { $set: { images: imageArray } });

//   const form = new multiparty.Form({
//     maxFilesSize: 10 * 1024 * 1024, // 10 MB
//     maxFieldsSize: 10 * 1024 * 1024, // 10 MB
//   });
//   try {
//     form.parse(request, async (err, fields, files) => {
//       const { images: pictures } = files;
//       console.log(files)
//
//       const { task } = fields;
//
//       const taskData: TaskType | null = await Task.findOne({ _id: task });
//       if (!taskData) {
//         return reply.status(404).send({ message: "Task not found" });
//       }
//       const { images: imageArray } = taskData;
//       const imagePath = `./uploads/${id}/orig/`;
//       if (!fs.existsSync(imagePath)) {
//         fs.mkdirSync(imagePath, { recursive: true });
//       }
//       const thumbPath = `./uploads/${id}/thumb/`;
//       if (!fs.existsSync(thumbPath)) {
//         fs.mkdirSync(thumbPath, { recursive: true });
//       }
//       for (const image of pictures) {
//         const { path: tempFile, originalFilename } = image;
//         const fullMimeType = mime.lookup(originalFilename) as string;
//         const mimeType: string = fullMimeType.replace(/^.+\//, ".");
//         const imageSaveTo = path.join(
//           imagePath,
//           `${email}_${uuidv4()}${mimeType}`
//         );
//         console.log(image)
//         const thumbSaveTo = path.join(
//           thumbPath,
//           `${email}_${uuidv4()}_thumb${mimeType}`
//         );
//         const imageBuffer: Buffer = fs.readFileSync(tempFile);
//         const thumbBuffer: Buffer = await sharp(imageBuffer)
//           .resize(100, 100, { fit: "cover" })
//           .toBuffer();
//
//         // fs.writeFileSync(imageSaveTo, imageBuffer);
//         // fs.writeFileSync(thumbSaveTo, thumbBuffer);
//
//         const addImage = new Image({
//           user: id,
//           task: task,
//           filename: originalFilename,
//           mimetype: mimeType,
//           size: imageBuffer.length,
//           image: imageBuffer,
//           path: imageSaveTo,
//         });
//
//         const addThumb = new Thumb({
//           user: id,
//           task: task,
//           image: addImage._id,
//           filename: originalFilename,
//           size: thumbBuffer.length,
//           thumb: thumbBuffer,
//           mimetype: mimeType,
//           thumbPath: thumbSaveTo,
//         });
//         await addImage.save();
//         await addThumb.save();
//
//         await Image.updateOne(
//           { _id: addImage._id },
//           { $set: { thumb: addThumb._id } }
//         );
//
//         imageArray.push(addImage._id);
//         fs.unlinkSync(tempFile);
//       }
//
//       await Task.updateOne({ _id: task }, { $set: { images: imageArray } });
//     });
//   } catch (error) {
//     reply.status(400).send({ message: "Images upload error" });
//   }
//
//   reply.send({ message: "Images uploaded successfully" });
// } catch (error) {
//   reply.status(400).send({ message: "Images upload error" });
// }
// };
