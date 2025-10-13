import { NextFunction, Request, Response } from "express";
import { jwtHelper } from "../helper/jwtHelper";

const auth = (...authRoles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.cookies.accessToken;
      if (!token) {
        throw new Error("You are not Authorizes");
      }
      const verifyUser = jwtHelper.verifyToken(token, "secret");

      req.user = verifyUser;

      if (!authRoles.includes(verifyUser.role)) {
        throw new Error("You are not Authorizes");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
