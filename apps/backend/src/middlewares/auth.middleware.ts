import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import type { DecodedAccessToken } from "../types/index.js";

export const verifyToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken: string =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!accessToken) {
      return res
        .status(401)
        .json({ status: 401, mssg: "Unauthorized request", user: {} });
    }
    const decodedAccessToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as DecodedAccessToken;
    const user = await User.findOne({ email: decodedAccessToken.email }).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res
        .status(404)
        .json({ status: 404, user: {}, message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({
      status: 401,
      message: "Invalid or expired token",
      user: {},
    });
  }
};
