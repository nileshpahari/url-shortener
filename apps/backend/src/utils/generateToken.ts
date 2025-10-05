import { type IUser } from "../models/user.model.js";
export const generateToken = async (
  user: IUser
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw Error("Failed to generate tokens");
  }
};
