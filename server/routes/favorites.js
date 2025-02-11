import express from "express";
import {
    getAllFavorites,
    addFavorite,
    deleteFavorite,
    isFavorite
} from "../controllers/favorites.js";

const router = express.Router();

router.post("/remove", deleteFavorite);
router.post("/add", addFavorite);
router.get("/list/:user_id", getAllFavorites);
router.post("/check", isFavorite);

export default router;