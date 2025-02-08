const cron = require('node-cron');
import {
    savePokemonTypesFromApi,
    savePokemonListFromApi,
    savePokemonEvolutionsFromApi
} from "controllers/pokeapi.js";


cron.schedule('0 0 3 * *', savePokemonTypesFromApi);
cron.schedule('0 0 4 * *', savePokemonListFromApi);
cron.schedule('0 0 5 * *', savePokemonEvolutionsFromApi);

