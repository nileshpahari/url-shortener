import type { IUser } from "../models/user.model.js";
import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  user: IUser;
}

export interface DecodedAccessToken extends JwtPayload {
  email: string;
}
