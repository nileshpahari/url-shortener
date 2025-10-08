import mongoose from "mongoose";

interface Url {
  id: string;
  redirectURL: string;
  clicks: number;
  clickHistory: { timestamp: number }[];
  creator: mongoose.Schema.Types.ObjectId;
  recordClick(): Promise<void>
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
  this.clickHistory.push({ timestamp: Date.now() });
  this.clicks += 1;
  await this.save();
};

urlSchema.pre("save", function (next) {
  // normalization before saving
  if (this.isModified("redirectURL") && !/^https?:\/\//i.test(this.redirectURL)) {
    this.redirectURL = `https://${this.redirectURL}`;
  }
  next();
});

export const Url = mongoose.model("Url", urlSchema);
