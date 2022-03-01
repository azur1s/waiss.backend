import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { DatabaseManager, IUser } from "../database/DatabaseManager";
import { LoggedInRequest } from "../types";

export const auth = (db: DatabaseManager) => {
  return async (req: LoggedInRequest, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
      try {
        const payloadUser = jwt.verify(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET!) as IUser;
        const user = await db.find_user_by_uuid(payloadUser.uuid);

        if (!user) return res.status(403).json({ message: "user.notFound" });
        req.user = user;
        return next();
      } catch (error) {
        return res.status(403).json({ message: "invalid.authenticationToken" });
      }
    }
    return res.status(403).json({ message: "header.authorizationUnset" });
  };
};
