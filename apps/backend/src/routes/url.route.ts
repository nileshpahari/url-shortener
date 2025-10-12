import { Router } from "express";
import { deleteUrl, genShortUrl, getUrls, redirectURL, showAnalytics } from "../controllers/url.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyTokenOptional } from "../middlewares/optionalAuth.middleware.js";

const router: Router = Router();

router.route("/all").get(verifyToken, getUrls as any)
router.route("/create").post(verifyTokenOptional ,genShortUrl as any)
router.route("/:id").get(redirectURL)
router.route("/analytics/:id").get(verifyToken, showAnalytics as any)
router.route("/delete/:id").delete(verifyToken, deleteUrl as any)

export default router;