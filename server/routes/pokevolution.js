import express from "express";
import {
    getAllPokevolutions,
    getOnePokevolution,
    addPokevolution,
    updatePokevolution,
    deletePokevolution,
    getGroupedByPosition
} from "../controllers/pokevolution.js";

const router = express.Router();

router.get("/list", getAllPokevolutions);
router.get("/get/:id", getOnePokevolution);
router.get("/grouped/:id", getGroupedByPosition);
router.post("/add", addPokevolution);
router.patch("/edit/:id", updatePokevolution);
router.delete("/delete/:id", deletePokevolution);

export default router;