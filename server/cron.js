const cron = require('node-cron');
const axios = require('axios');
const Pokemon = require('./models/Pokemon'); // Example model

// Schedule a task to run every hour
cron.schedule('0 * * * *', async () => {
    console.log('Fetching latest Pokémon data...');
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
    const data = response.data.results;

    // Save data to the database
    data.forEach(async (pokemon) => {
        await Pokemon.findOneAndUpdate({ name: pokemon.name }, pokemon, { upsert: true });
    });
    console.log('Pokémon data updated successfully.');
});
