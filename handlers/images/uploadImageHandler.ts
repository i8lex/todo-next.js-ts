import * as jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import mime from 'mime-types';
import path from "path";
import sharp from "sharp";
import { Task } from "../../lib/models/taskModel";
import { Image } from "../../lib/models/imageModel";
import { Thumb } from "../../lib/models/thumbModel";
import multiparty from 'multiparty';


export const uploadImageHandler = async (request, reply) => {
    try {
        const { verify } = jwt.default;
        const authHeader = request.headers.authorization;
        const token = authHeader ? authHeader.split(" ")[1] : null;
        const { id, email } = await verify(token, process.env.SECRET_WORD);
        const form = new multiparty.Form();

        try {
            form.parse(request, async (err, fields, files) => {
                const { images: pictures } = files;
                const { task } = fields;
                const { images: imageArray } = await Task.findOne({ _id: task })
                const imagePath = `./uploads/${id}/orig/`;
                if (!fs.existsSync(imagePath)) {
                    fs.mkdirSync(imagePath, { recursive: true });
                }
                const thumbPath = `./uploads/${id}/thumb/`;
                if (!fs.existsSync(thumbPath)) {
                    fs.mkdirSync(thumbPath, { recursive: true });
                }
                for (const image of pictures)  {
                    console.log(image)
                    const { path: tempFile , originalFilename } = image;
                    const fullMimeType: mime = mime.lookup(originalFilename);
                    const mimeType: string = fullMimeType.replace(/^.+\//, ".");
                    const imageSaveTo = path.join(
                        imagePath,
                        `${email}_${uuidv4()}${mimeType}`
                    );
                    const thumbSaveTo = path.join(
                        thumbPath,
                        `${email}_${uuidv4()}_thumb${mimeType}`
                    );
                    const imageBuffer: Buffer = fs.readFileSync(tempFile);
                    const thumbBuffer: Buffer = await sharp(imageBuffer)
                        .resize(100, 100, { fit: "cover" })
                        .toBuffer();

                    // fs.writeFileSync(imageSaveTo, imageBuffer);
                    // fs.writeFileSync(thumbSaveTo, thumbBuffer);

                    const addImage = new Image({
                        user: id,
                        task: task,
                        filename: originalFilename,
                        mimetype: mimeType,
                        size: imageBuffer.length,
                        image: imageBuffer,
                        path: imageSaveTo,
                    });

                    const addThumb = new Thumb({
                        user: id,
                        task: task,
                        image: addImage._id,
                        filename: originalFilename,
                        size: thumbBuffer.length,
                        thumb: thumbBuffer,
                        mimetype: mimeType,
                        thumbPath: thumbSaveTo,
                    });
                    await addImage.save();
                    await addThumb.save();

                    await Image.updateOne(
                        { _id: addImage._id },
                        { $set: { thumb: addThumb._id } }
                    );

                    imageArray.push(addImage._id);

                    fs.unlinkSync(tempFile);
                }


                await Task.updateOne({ _id: task }, { $set: { images: imageArray } });
            });
        } catch (error) {
            reply.status(400).send({ message: "Images upload error" }, error);
        }

        reply.send({ message: "Images uploaded successfully" });
    } catch (error) {
        reply.status(400).send({ message: "Images upload error" }, error);
    }
};

