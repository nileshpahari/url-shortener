import type { Response, Request } from "express";
import { Url } from "../models/url.model.js";
import { nanoid } from "nanoid";
import type { AuthRequest } from "../types/index.js";

export const getUrls = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const urls = await Url.find({
      creator: user._id,
    }).sort({ createdAt: -1 });
    return res.status(200).json({
      status: 200,
      mssg: "Fetched all the user created URLs successfully",
      urls,
    });
  } catch (err) {
    console.error("Failed fetching user's URLs ", err);
    return res.status(500).json({
      status: 500,
      mssg: "Failed to fetch all the user created URLs",
      urls: [],
    });
  }
};

export const genShortUrl = async (req: AuthRequest, res: Response) => {
  try {
    const { redirectURL } = req.body;
    if (!redirectURL) {
      return res.status(400).json({
        status: 400,
        mssg: "Please provide all the required fields",
        url: {},
      });
    }
    const id = nanoid(4);
    const url = await Url.create({
      id,
      redirectURL,
      creator: req.user?._id || null,
      clickHistory: [],
    });
    if (!url) {
      return res.status(500).json({
        status: 500,
        mssg: "Failed to generate short URL",
        url: {},
      });
    }
    res.status(201).json({
      status: 201,
      mssg: "Short URL generated successfully",
      url,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 500,
      mssg: "Internal server error",
      url: {},
    });
  }
};

export const redirectURL = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ status: 400, mssg: "Bad request", url: {} });
    }
    const url = await Url.findOne({ id });
    if (!url) {
      return res
        .status(404)
        .json({ status: 404, mssg: "Invalid short url", url: {} });
    }
    await url.recordClick();
    res.redirect(`${url.redirectURL}`);
  } catch (err) {
    console.error("Redirect failed:", err);
    return res.status(500).json({ status: 500, mssg: "Internal server error" });
  }
};

export const showAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ status: 400, mssg: "Bad request", url: {} });
    }
    const url = await Url.findOne({ id });
    if (!url) {
      return res
        .status(404)
        .json({ status: 404, mssg: "Invalid short url", url: {} });
    }
    res
      .status(200)
      .json({ status: 200, mssg: "URL details fetched successfully", url });
  } catch (err) {
    console.error("Failed showing analytics: ", err);
    return res.status(500).json({ status: 500, mssg: "Internal server error" });
  }
};

export const deleteUrl = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ status: 400, mssg: "Bad request", url: {} });
    }

    const url = await Url.findOne({ id });
    if (!url)
      return res
        .status(404)
        .json({ status: 404, mssg: "Invalid short URL", url: {} });

    if (url.creator?.toString() !== req.user?._id?.toString()) {
      return res
        .status(403)
        .json({ status: 403, mssg: "Not authorized", url: {} });
    }

    await Url.deleteOne({ id });
    return res
      .status(200)
      .json({ status: 200, mssg: "URL record deleted successfully", url });
  } catch (err) {
    console.error("Delete failed:", err);
    return res.status(500).json({ status: 500, mssg: "Internal server error" });
  }
};
