import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { getTaskHandler } from "@/handlers/tasks/getTasksHandler";
import { createTaskHandler } from "@/handlers/tasks/createTaskHandler";
import { authMiddleware } from "@/middlewares/authMiddleware";

export default authMiddleware(async function tasksHandlers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await db.connect();
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        await getTaskHandler(req, res);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
      }
      break;

    case "POST":
      try {
        await createTaskHandler(req, res);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
      }

      break;

    case "PUT":
      try {
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
      }

      break;

    case "DELETE":
      try {
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
      }

      break;

    default:
      res.status(405).end();
      break;
  }
});
