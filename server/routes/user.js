import express from "express";
import {
    getAllUsers,
    getOneUser,
    register,
    login
} from "../controllers/user.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/get/:id", getOneUser);
router.get("/list", getAllUsers);

export default router;