import Pokevolution from "../models/Pokevolution.js";
import Pokemon from "../models/Pokemon.js";


//================= Add a pokemon evolution row =======================//
export const addPokevolution = async (req, res, next) => {
    const newPokevolution = new Pokevolution(req.body)

    try {
        const savedPokevolution = await newPokevolution.save();
        res.status(200).json(savedPokevolution);
    }
    catch (err) {
        next(err)
    }
}


//================= List all pokemon evolutions =======================//
export const getAllPokevolutions = async (req, res, next) => {
    try {
        const pokevolutionList = await Pokevolution.findAll();
        res.status(200).json(pokevolutionList);
    } catch (err) {
        next(err)
    }
}


//================= Get One pokemon evolution chain =======================//
export const getOnePokevolution = async (req, res, next) => {
    try {
        const chain_id = req.params.id; //get the chain ID and subsequently all the evolutions of that chain ID
        const onePokevolution = await Pokevolution.findAll({
            where: { pokechain_id: chain_id },
            include: [
                { model: Pokemon, attributes: ['id','name','image_path'] }
            ]
        });

        const modifiedPokevolution = onePokevolution.map(row => ({
            ...row.get({ plain: true }), // Spread all properties of the original object
            pokemon_id: row.Pokemon.id,
            pokemon_name: row.Pokemon.name,
            pokemon_image_path: row.Pokemon.image_path
        }));

        res.status(200).json(modifiedPokevolution);
    } catch (err) {
        next(err)
    }
}


//================= Update a pokemon evolution =======================//
export const updatePokevolution = async (req, res, next) => {
    try {
        const editedPokevolution = await Pokevolution.update(
            req.body, {where: {id: req.params.id}}
        );
        res.status(200).json(editedPokevolution);
    } catch (err) {
        next(err);
    }
}


//================= Delete a pokemon evolution =======================//
export const deletePokevolution = async (req, res, next) => {
    try {
        await Pokevolution.destroy( { where: { id: req.params.id } });
        res.status(200).json("The selected pokevolution has been deleted");
    } catch (err) {
        next(err);
    }
};
