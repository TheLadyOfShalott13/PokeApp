import express from "express";
import {
    getAllPoketypes,
    getOnePoketype,
    addPoketype,
    updatePoketype,
    deletePoketype
} from "../controllers/poketype.js";

const router = express.Router();

router.get("/list", getAllPoketypes);
router.get("/get/:id", getOnePoketype);
router.post("/add", addPoketype);
router.patch("/edit/:id", updatePoketype);
router.delete("/delete/:id", deletePoketype);

export default router;