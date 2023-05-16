import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { getImageHandler } from "../../../handlers/images/getImageHandler";
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
      await getImageHandler(req, res);
      break;

    case "POST":
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