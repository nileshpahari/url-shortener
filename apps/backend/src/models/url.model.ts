import mongoose from "mongoose";
import type { IUser } from "./user.model.js";

interface Url {
  id: string;
  redirectURL: string;
  clicks: number;
  clickHistory: { timestamp: number }[];
  creator: mongoose.Schema.Types.ObjectId;
}

const urlSchema = new mongoose.Schema<Url>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    redirectURL: {
      type: String,
      required: true,
      trim: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    clickHistory: [{ timestamp: { type: Number } }],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

urlSchema.methods.recordClick = async function () {
  this.clicks += 1;
  this.clickHistory.push({ timestamp: Date.now() });
  await this.save();
};

export const Url = mongoose.model("Url", urlSchema);
