import { Router } from "express";
import { deleteUserAccn, getCurrentUser, login, logout, register, updatePassword } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router: Router = Router();

router.get("/current-user", verifyToken, getCurrentUser as any);
router.post("/login", login);
router.post("/register", register);
router.post("/logout", verifyToken, logout as any);
router.post("/delete-user-account", verifyToken, deleteUserAccn as any);
router.post("/update-password", verifyToken, updatePassword as any);

export default router
