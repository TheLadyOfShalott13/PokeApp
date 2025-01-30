import express from "express";
import {
    getAllPokemon,
    getOnePokemon,
    addPokemon,
    updatePokemon,
    deletePokemon
} from "../controllers/pokemon.js";

const router = express.Router();

router.get("/list", getAllPokemon);
router.get("/get/:id", getOnePokemon);
router.post("/add", addPokemon);
router.patch("/edit/:id", updatePokemon);
router.delete("/delete/:id", deletePokemon);

export default router;