import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "@/utils/tokenUtils";

export const authMiddleware = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader ? authHeader.replace("Bearer ", "") : null;
      if (!token || !verifyToken(token)) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      await handler(req, res);
    } catch (error) {
      console.error("Error handling request:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};
