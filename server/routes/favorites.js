import express from "express";
import {
    getAllFavorites,
    addFavorite,
    deleteFavorite
} from "../controllers/favorites.js";

const router = express.Router();

router.post("/remove", deleteFavorite);
router.get("/add", addFavorite);
router.get("/list/:user_id", getAllFavorites);

export default router;