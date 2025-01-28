import express from "express";
import {
    getAllFavorites,
    addFavorite,
    deleteFavorite
} from "../controllers/favorites.js";

const router = express.Router();

router.post("/remove", deleteFavorite);
router.get("/add", addFavorite);
router.get("/list", getAllFavorites);

export default router;