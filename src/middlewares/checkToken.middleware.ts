import { Request, Response, NextFunction } from "express";
import { verify } from "@utils";

interface CustomRequest extends Request {
  user?: any;
}

export let checkToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.redirect("/");
  }

  try {
    const decoded = verify(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).send({ message: "Invalid or expired token." });
  }
};
