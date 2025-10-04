import type { IUser } from "../models/user.model.js";
import type { Request } from "express";

export interface AuthRequest extends Request {
  user: IUser;
}
