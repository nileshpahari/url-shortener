import { Router } from "express";
import { deleteUrl, genShortUrl, redirectURL, showAnalytics } from "../controllers/url.controller.js";

const router: Router = Router();

router.route("/create").post(genShortUrl as any)
router.route("/:id").get(redirectURL)
router.route("/analytics/:id").get(showAnalytics)
router.route("/delete/:id").get(deleteUrl)

export default router;