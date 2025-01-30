const cron = require('node-cron');
const axios = require('axios');
import Pokemon from "/models/Pokemon.js";

// Schedule a task to run every day 3 am
cron.schedule('0 0 3 * *', async () => {
    console.log('Fetching latest Pokémon data...');
    const limit = 150;
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
    const data = response.data.results;

    // Save data to the database
    data.forEach(async (pokemon) => {
        await Pokemon.findOneAndUpdate(
            { name: pokemon.name },
            pokemon,
            { upsert: true }
        );
    });
    console.log('Pokémon data updated successfully.');
});
