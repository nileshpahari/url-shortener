import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  email: string;
  password: string;
  fullName: string;
  // avatar: string | null;
  refreshToken: string | null;
  isPassCorrect(pass: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    // avatar: {
    //   type: String,
    // },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isPassCorrect = async function (pass: string) {
  return await bcrypt.compare(pass, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET as string
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET as string
  );
};

export const User = mongoose.model("User", userSchema);
