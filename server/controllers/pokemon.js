import Pokemon from "../models/Pokemon.js";
import Poketype from "../models/Poketype.js";
const colours = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
};


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
        const pokemonTypesList = await Poketype.findAll();
        let pokemonTypes = {}
        pokemonTypesList.map(type => {
            pokemonTypes[type.id] = type.name;
        })

        const pokemonList = await Pokemon.findAll();

        const modifiedPokemons = pokemonList.map((pokemon) => {
            const types = pokemon.poketypes.split(",");
            const pokemonType = types.map((type) => ({
                id: type,
                name: pokemonTypes[type],
                colour: colours[pokemonTypes[type]],
            }));
            return { ...pokemon.get({plain: true}), type: pokemonType };
        });

        res.status(200).json(modifiedPokemons);
    } catch (err) {
        next(err)
    }
}


//================= Get One pokemon =======================//
export const getOnePokemon = async (req, res, next) => {
    try {

        const pokemonTypesList = await Poketype.findAll();
        let pokemonTypes = {}
        pokemonTypesList.map(type => {
            pokemonTypes[type.id] = type.name;
        })

        const onePokemon = await Pokemon.findAll({ where: { id: req.params.id } });

        const modifiedPokemon = onePokemon.map((pokemon) => {
            const types = pokemon.poketypes.split(",");
            const pokemonType = types.map((type) => ({
                id: type,
                name: pokemonTypes[type],
                colour: colours[pokemonTypes[type]],
            }));
            return { ...pokemon.get({plain: true}), type: pokemonType };
        });

        res.status(200).json(modifiedPokemon);

    } catch (err) {
        next(err)
    }
}


//================= Update a pokemon =======================//
export const updatePokemon = async (req, res, next) => {
    try {
        const editedPokemon = await Pokemon.update(
            req.body, {where: {id: req.params.id}}
        );
        res.status(200).json(editedPokemon);
    } catch (err) {
        next(err);
    }
}


//================= Delete a pokemon =======================//
export const deletePokemon = async (req, res, next) => {
    try {
        await Pokemon.destroy( { where: { id: req.params.id } });
        res.status(200).json("The selected pokemon has been deleted");
    } catch (err) {
        next(err);
    }
};
