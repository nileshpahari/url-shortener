import type { Response, Request } from "express";
import { User, type IUser } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import type { AuthRequest } from "../types/index.js";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // switch to zod
    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        mssg: "Please provide all the requried fields",
        user: {},
      });
    }
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        status: 400,
        message: "Email and password must be strings",
        user: {},
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 404,
        mssg: "User not found",
        user: {},
      });
    }
    const isPassCorrect = await user.isPassCorrect(password);
    if (!isPassCorrect) {
      return res.status(401).json({
        status: 401,
        mssg: "Invalid user credentials",
        user: {},
      });
    }
    const { accessToken, refreshToken } = await generateToken(user);
    return res
      .status(200)
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", refreshToken)
      .json({
        status: 200,
        mssg: "User logged in successfully",
        user: {
          email: user.email,
          fullName: user.fullName,
          avatar: user.avatar,
        },
        // accessToken,
        // refreshToken,
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      mssg: "Internal server error",
      user: {},
    });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  await User.findByIdAndUpdate(req.user._id, {
    $unset: {
      refreshToken: 1,
    },
  }).select("-password");

  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json({
      status: 200,
      mssg: "Logged-out successfully",
      user: {},
    });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, avatar, password, email } = req.body;
    if (!fullName || !password || !email) {
      return res.status(400).json({
        status: 400,
        mssg: "Please provide all the required fields",
        user: {},
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: 409,
        mssg: "User already exists",
        user: {},
      });
    }
    if (avatar) {
      // cloudinary logic
    }
    await User.create({
      fullName,
      email,
      password,
      avatar: avatar ?? null,
    });
    const user = await User.findOne({ email }).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res.status(500).json({
        status: 500,
        mssg: "Failed to register user",
        user: {},
      });
    }
    const { accessToken, refreshToken } = await generateToken(user);
    return res
      .status(201)
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", refreshToken)
      .json({
        status: 201,
        mssg: "User registered and logged in successfully",
        user,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      mssg: "Something went wrong during registration",
      user: {},
    });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  return res
    .status(200)
    .json({ status: 200, mssg: "User fetched successfully", user: req.user });
};

export const deleteUserAccn = async (req: AuthRequest, res: Response) => {
  const { password } = req.body;
  // switch to zod
  if (!password) {
    return res.status(400).json({
      status: 400,
      mssg: "Password is required to delete the user account",
      user: {},
    });
  }

  if (typeof password !== "string") {
    return res.status(400).json({
      status: 400,
      message: "Email and password must be strings",
      user: {},
    });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({
      status: 404,
      mssg: "User not found",
      user: {},
    });
  }
  const isPassCorrect = await user.isPassCorrect(password);
  if (!isPassCorrect) {
    return res.status(401).json({
      status: 401,
      mssg: "Invalid user credentials",
      user: {},
    });
  }
  await User.findByIdAndDelete(req.user._id);
  res
    .status(200)
    .json({ status: 200, mssg: "User deleted successfully", user: {} });
};

export const updatePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { oldPass, newPass } = req.body;
    if (!oldPass || !newPass) {
      return res.status(400).json({
        status: 400,
        mssg: "Please provide all the requried fields",
        user: {},
      });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        status: 404,
        mssg: "User not found",
        user: {},
      });
    }
    const isPassCorrect = await user.isPassCorrect(oldPass);
    if (!isPassCorrect) {
      if (!isPassCorrect) {
        return res
          .status(401)
          .json({ status: 401, mssg: "Incorrect password", user: {} });
      }
    }
    user.password = newPass;
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json({ status: 401, mssg: "Password updated successfully", user: {} });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: 500, mssg: "Failed to update the password", user: {} });
  }
};
