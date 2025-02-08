import axios from "axios";
import Pokemon from "../models/Pokemon.js";
import Poketype from "../models/Poketype.js";
import Pokevolution from "../models/Pokevolution.js";
import sequelize from "../config/conn.js";

const base_url = 'https://pokeapi.co/api/v2';
const api_url = {
    'LIST' : '/pokemon',
    'SINGLE' : '/pokemon/',
    'SPECIES' : '/pokemon-species',
    'EVOLUTION' : '/evolution-chain/',
    'TYPES': '/type',
};


//================= CRON 1: Get a list of pokemon types =======================//
export const savePokemonTypesFromApi = async() => {
    try {
        const type = 'TYPES'
        const getPokemonTypesUrl = base_url + api_url[type]
        const response = await axios.get(getPokemonTypesUrl, { timeout: 10000 })
        const poketypes = response.data.results;

        const t = await sequelize.transaction();                                          // Use a transaction to ensure data integrity
        try {
            for (const poketype of poketypes) {                                                // Loop through poketypes and insert/update if exists into database
                const pokeapi_id = poketype.url.replace(getPokemonTypesUrl, "").match(/\d+/)[0];    // pokeapi_id is the integer get parameter from the pokemon type url
                await Poketype.upsert(
                    { id: pokeapi_id, name: poketype.name },                                 // pokeapi_id is the unique key hence it will update if found on the basis of this id
                    { transaction: t }
                );
            }
            await t.commit();
            console.log('Pokemon types saved successfully.');
        } catch (error) {
            await t.rollback();
            throw error;
        }
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            console.error('Request timed out:', error.message);
        } else {
            console.error('Error fetching Pokémon types:', error.message);
        }
    }
}


//================= CRON 2: Get a list of pokemon and save them to the database =======================//

export const fetchPokemonInfo = async (pokemon) => {
    const type = 'SINGLE'
    const getPokemonInfoUrl = base_url + api_url[type] + pokemon
    const response = await axios.get(getPokemonInfoUrl, { timeout: 10000 });
    return response.data;
};

export const fetchPokemonList = async (limit) => {
    const type = 'LIST'
    const getPokemonListUrl = base_url + api_url[type] + '?limit=' + limit
    const response = await axios.get(getPokemonListUrl, { timeout: 10000 });
    return response.data.results;
};

export const fetchPokemonSpeciesInfo = async (pokemon_species_url) => {
    const response = await axios.get(pokemon_species_url, { timeout: 10000 });
    return response.data;
};

export const savePokemonData = async (data, transaction) => {
    await Pokemon.upsert(data, { transaction });
};


export const savePokemonListFromApi = async() => {
    try {
        const limit = 150
        const pokemon_list = await fetchPokemonList(limit);          //fetch list of pokemon

        const t = await sequelize.transaction();                     // Use a transaction to ensure data integrity
        try {
            for (const pokemon_item of pokemon_list) {                     // Loop through poketypes and insert/update if exists into database
                let dataToSave = await getPokemonData(pokemon_item.name);  // Fetch each pokemon's data
                await savePokemonData(dataToSave,t)
                console.log(pokemon_item.name + ' processed successfully.');
            }
            await t.commit();
            console.log('Pokemon saved successfully.');
        } catch (error) {
            await t.rollback();
            throw error;
        }
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            console.error('Request timed out:', error.message);
        } else {
            console.error('Error fetching Pokemon:', error.message);
        }
    }
}


//================= Return pokemon data to be saved =======================//
export const getPokemonData = async(pokemon) => {
    const getPokemonTypesUrl = base_url + api_url['TYPES'];
    const getPokemonSpeciesUrl = base_url + api_url['SPECIES'];
    const pokeInfo = await fetchPokemonInfo(pokemon)
    const pokeSpecies = await fetchPokemonSpeciesInfo(pokeInfo.species.url)
    let data = {}

    data.name           = pokeInfo.name;
    data.identifier     = pokeInfo.id;
    data.slug           = pokeInfo.name;
    data.image_path     = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" + pokeInfo.id + ".png";
    data.pokespecies_id = pokeInfo.species.url.replace(getPokemonSpeciesUrl, "").match(/\d+/)[0];
    data.pokechain_id   = pokeSpecies.evolution_chain.url.replace(getPokemonSpeciesUrl, "").match(/\d+/)[0];
    data.poketypes      = "";

    pokeInfo.types.forEach(poketype => {
        const poketype_id = poketype.type.url.replace(getPokemonTypesUrl, "").match(/\d+/)[0];
        data.poketypes += poketype_id + ",";
    })

    data.poketypes = data.poketypes.slice(0, -1);

    return data;
}


//================= Function to process the pokemon evolution===============//
const processEvolvedTo = async (evolution_chain_id, position, evolution_chain, t) => {
    for (const evolution of evolution_chain) {
        let dataToSave = {};
        dataToSave.pokechain_id     = evolution_chain_id;
        dataToSave.position         = position;
        dataToSave.pokemon_id       = pokemonIdentifierMap[evolution.species.name];
        dataToSave.ways             = evolution.evolution_details.length;     //count the number of ways one could evolve to this state

        await Pokevolution.upsert(dataToSave, { transaction: t });
        console.log(`${evolution.species.name} processed successfully.`);
        for (const evolution_type of evolution.evolves_to){             //evolves_to is an array object from the api and contains pokemon details
            await processEvolvedTo(evolution_chain_id, position + 1, evolution_type, t);
        }
    }
}


//================= Function to iterate through Pokémon Evolution Map =======================//
export const savePokemonEvolutionsFromApi = async () => {
    try {
        //initialize the map objects then fetch the info from our database
        const pokemonEvolutionMap       = {};       //Map object:- {pokemon database id : pokemon api evolution chain id}
        const pokemonIdentifierMap      = {};       //Map object:- {pokemon api identifier id : pokemon database id}
        const pokemonEvolutionData  = await Pokemon.findAll({ attributes: ['id','slug', 'pokechain_id'] });

        //setting the id and values for both maps
        pokemonEvolutionData.forEach(pokemon => {
            pokemonIdentifierMap[pokemon.slug]  = pokemon.id;
            pokemonEvolutionMap[pokemon.id]     = pokemon.pokechain_id;
        });

        const getPokemonEvolutionUrl = base_url + api_url['EVOLUTION'];     //initializing the base url of the evolution api url
        let processedEvolutionIDs = []                                      //array to record already processed evolution ids

        for (const pokemon_db_id in pokemonEvolutionMap) {                         //looping through the evolution ID map
            const pokemon_evolution_id = pokemonEvolutionMap[pokemon_db_id];

            if (!processedEvolutionIDs.includes(pokemon_evolution_id)) {           //only fetch the evolution chain if evolution id not already processed

                const pokemon_evolution = await axios.get(getPokemonEvolutionUrl + pokemon_evolution_id, { timeout: 10000 })
                let position = 1                                           //this variable records the pokemon position within the evolution chain
                const t = await sequelize.transaction();                // Use a transaction to ensure data integrity

                try {
                    await processEvolvedTo(pokemon_evolution_id, position, pokemon_evolution.chain, t)
                    await t.commit();
                    console.log('Pokemon Evolutions saved successfully.');
                } catch (error) {
                    await t.rollback();
                    throw error;
                }

                processedEvolutionIDs.push(pokemon_evolution_id);
            }
        }

    } catch (error) {
        console.error('Error fetching Pokémon evolution map:', error.message);
    }
};
