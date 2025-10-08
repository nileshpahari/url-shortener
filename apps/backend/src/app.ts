import express, { type Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// constants
const corsConfig = {
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
};

const app: Application = express();

app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// router(s)
import urlRouter from "./routes/url.route.js";
import userRouter from "./routes/user.route.js";

// route(s)
app.use("/api/url", urlRouter);
app.use("/api/user", userRouter);


export default app;
