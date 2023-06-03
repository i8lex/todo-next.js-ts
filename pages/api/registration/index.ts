import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { postRegistrationHandler } from "@/handlers/auth/registrationHandler";

export default async function registrationHandlers(
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
        await db.connect();
        await postRegistrationHandler(req, res);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
      }
      break;

    case "PUT":
      // ...
      break;

    case "DELETE":
      // ...
      break;

    default:
      res.status(405).end();
      break;
  }
}
