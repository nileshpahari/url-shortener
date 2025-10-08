import { Router } from "express";
import { deleteUserAccn, getCurrentUser, login, logout, register, updatePassword } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router: Router = Router();

router.get("/current-user", verifyToken, getCurrentUser as any);
router.post("/login", login);
router.post("/register", register);
router.post("/logout", verifyToken, logout as any);
router.delete("/delete-user", verifyToken, deleteUserAccn as any);
router.patch("/update-password", verifyToken, updatePassword as any);

export default router 
