import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { deleteTaskHandler } from "@/handlers/tasks/deleteTaskHandler";
import { changeTaskHandler } from "@/handlers/tasks/changeTaskHandler";
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
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
      }
      break;

    case "POST":
      try {
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
      }

      break;

    case "PUT":
      try {
        await changeTaskHandler(req, res);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
      }

      break;

    case "DELETE":
      try {
        await deleteTaskHandler(req, res);
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
