import Poketype from "../models/Poketype.js";


//================= Add a poketype type =======================//
export const addPoketype = async (req, res, next) => {
    const newPoketype = new Poketype(req.body)

    try {
        const savedPoketype = await newPoketype.save();
        res.status(200).json(savedPoketype);
    }
    catch (err) {
        next(err)
    }
}


//================= List all poketypes =======================//
export const getAllPoketypes = async (req, res, next) => {
    try {
        const poketypeList = await Poketype.findAll();
        res.status(200).json(poketypeList);
    } catch (err) {
        next(err)
    }
}


//================= Get One poketype =======================//
export const getOnePoketype = async (req, res, next) => {
    try {
        const onePoketype = await Poketype.findAll({ where: { id: req.params.id } });
        res.status(200).json(onePoketype);
    } catch (err) {
        next(err)
    }
}


//================= Update a poketype =======================//
export const updatePoketype = async (req, res, next) => {
    try {
        const editedPoketype = await Poketype.update(
            req.body, {where: {id: req.params.id}}
        );
        res.status(200).json(editedPoketype);
    } catch (err) {
        next(err);
    }
}


//================= Delete a poketype =======================//
export const deletePoketype = async (req, res, next) => {
    try {
        await Poketype.destroy( { where: { id: req.params.id } });
        res.status(200).json("The selected poketype has been deleted");
    } catch (err) {
        next(err);
    }
};
