import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import type { DecodedAccessToken } from "../types/index.js";

export const verifyTokenOptional = async (
  req: any,
  _: Response,
  next: NextFunction
) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!accessToken) {
      next();
    }
    const decodedAccessToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as DecodedAccessToken;
    const user = await User.findOne({ email: decodedAccessToken.email }).select("-password -refreshToken");
    if (user) {
      req.user = user;
    }
  } catch (err) {
    console.error("Failed to optional verify jwt token ", err);
  } finally {
    next();
  }
};
