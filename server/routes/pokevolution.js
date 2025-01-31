import express from "express";
import {
    getAllPokevolutions,
    getOnePokevolution,
    addPokevolution,
    updatePokevolution,
    deletePokevolution
} from "../controllers/pokevolution.js";

const router = express.Router();

router.get("/list", getAllPokevolutions);
router.get("/get/:chain_id", getOnePokevolution);
router.post("/add", addPokevolution);
router.patch("/edit/:id", updatePokevolution);
router.delete("/delete/:id", deletePokevolution);

export default router;