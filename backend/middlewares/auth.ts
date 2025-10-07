import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const checkUserForAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  (req as any).user = null;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const userInfo = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = userInfo;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
