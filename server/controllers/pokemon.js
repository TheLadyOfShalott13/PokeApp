import Pokemon from "../models/Pokemon.js";


//================= Add a pokemon =======================//
export const addPokemon = async (req, res, next) => {
    const newPokemon = new Pokemon(req.body)

    try {
        const savedPokemon = await newPokemon.save();
        res.status(200).json(savedPokemon);
    }
    catch (err) {
        next(err)
    }
}


//================= List all pokemons =======================//
export const getAllPokemon = async (req, res, next) => {
    try {
        const pokemonList = await Pokemon.findAll();
        res.status(200).json(pokemonList);
    } catch (err) {
        next(err)
    }
}


//================= Get One pokemon =======================//
export const getOnePokemon = async (req, res, next) => {
    try {
        const onePokemon = await Pokemon.findAll({ where: { id: req.params.poke_id } });
        res.status(200).json(onePokemon);
    } catch (err) {
        next(err)
    }
}


//================= Update a pokemon =======================//
export const updatePokemon = async (req, res, next) => {
    try {
        const editedPokemon = await Pokemon.update(
            req.body, {where: {id: req.params.poke_id}}
        );
        res.status(200).json(editedPokemon);
    } catch (err) {
        next(err);
    }
}


//================= Delete a pokemon =======================//
export const deletePokemon = async (req, res, next) => {
    try {
        await Pokemon.destroy( { where: { poke_id: req.params.poke_id } });
        res.status(200).json("The selected pokemon has been deleted");
    } catch (err) {
        next(err);
    }
};
