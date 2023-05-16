import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { uploadImageHandler } from "../../../handlers/images/uploadImageHandler";
import { authMiddleware } from "../../../middlewares/authMiddleware";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default authMiddleware(async function imageHandlers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await db.connect();
  const { method } = req;
  switch (method) {
    case "GET":
      break;

    case "POST":
      try {
        await uploadImageHandler(req, res);
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal server error" });
      }
      break;

    case "PUT":
      // ...
      break;

    case "DELETE":
      break;

    default:
      res.status(405).end();
      break;
  }
});
