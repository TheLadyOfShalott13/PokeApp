//=============Set up all test tools================//
import * as chai from "chai";
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import sequelize from '../config/conn.js';

//============import object and functions to be tested and assertion objects===========//
import {
    fetchPokemonInfo,
    fetchPokemonList,
    fetchPokemonSpeciesInfo,
    savePokemonData,
    savePokemonListFromApi,
    getPokemonData
} from '../controllers/pokeapi.js';
import Pokemon from '../models/Pokemon.js';
import {expect} from 'chai';

chai.use(sinonChai);

//==================Some common test mocks==================//
const mockPokemonResponse = {
    name:           "pikachu",
    identifier:     "25",
    slug:           "pikachu",
    image_path:     "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    pokespecies_id: "25",
    pokechain_id:   "10",
    poketypes:      "13"
}

const mockPokemonInfo = {
    "id": 25,
    "name": "pikachu",
    "species": {
        "name": "pikachu",
        "url": "https://pokeapi.co/api/v2/pokemon-species/25/"
    },
    "types": [
        {
            "slot": 1,
            "type": {
                "name": "electric",
                "url": "https://pokeapi.co/api/v2/type/13/"
            }
        }
    ]
};

const mockPokemonEvolutionInfo = {
    "evolution_chain": {
        "url": "https://pokeapi.co/api/v2/evolution-chain/10/"
    }
}

const mockPokemonList = {
    "results":[
    { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }
]};

// ============== Fetch a single pokemon info from poke API tests================//
describe('fetchPokemonInfo', () => {
    let axiosMock;
    const baseUrl = 'https://pokeapi.co/api/v2/pokemon/pikachu';

    beforeEach(() => { axiosMock = new MockAdapter(axios); });
    afterEach(() => { axiosMock.restore(); });

    it('This function - fetchPokemonInfo - should just simply more details of the specified Pokemon from the pokeapi', async () => {
        axiosMock.onGet(baseUrl).reply(200, mockPokemonInfo);
        const result = await fetchPokemonList(baseUrl);
        expect(result).to.deep.equal(mockPokemonInfo);
    });

    it('This function - fetchPokemonList - should handle timeout error gracefully', async () => {
        axiosMock.onGet(baseUrl).timeout();
        try {
            await fetchPokemonInfo(baseUrl);
        } catch (error) {
            expect(error.code).to.equal('ECONNABORTED');
        }
    });
});


// ============== Fetch pokemon list from poke API tests================//
describe('fetchPokemonList', () => {
    let axiosMock;
    const baseUrl = 'https://pokeapi.co/api/v2/list';

    beforeEach(() => { axiosMock = new MockAdapter(axios); });
    afterEach(() => { axiosMock.restore(); });

    it('This function - fetchPokemonList - should just simply fetch the list of Pokemon from the pokeapi', async () => {
        axiosMock.onGet(baseUrl).reply(200, mockPokemonList);
        const result = await fetchPokemonList(baseUrl);
        expect(result).to.deep.equal(mockPokemonList);
    });

    it('This function - fetchPokemonList - should handle timeout error gracefully', async () => {
        axiosMock.onGet(baseUrl).timeout();
        try {
            await fetchPokemonList(baseUrl);
        } catch (error) {
            expect(error.code).to.equal('ECONNABORTED');
        }
    });
});


// ============== Fetch pokemon species info from poke API tests================//
describe('fetchPokemonSpeciesInfo', () => {
    let axiosMock;
    const baseUrl = 'https://pokeapi.co/api/v2/pokemon-species/25';

    beforeEach(() => { axiosMock = new MockAdapter(axios); });
    afterEach(() => { axiosMock.restore(); });

    it('This function - fetchPokemonSpeciesInfo - should just simply more details of the specified Pokemon from the pokeapi', async () => {
        axiosMock.onGet(baseUrl).reply(200, mockPokemonEvolutionInfo);
        const result = await fetchPokemonSpeciesInfo(baseUrl);
        expect(result).to.deep.equal(mockPokemonEvolutionInfo);
    });

    it('This function - fetchPokemonSpeciesInfo - should handle timeout error gracefully', async () => {
        axiosMock.onGet(baseUrl).timeout();
        try {
            await fetchPokemonSpeciesInfo(baseUrl);
        } catch (error) {
            expect(error.code).to.equal('ECONNABORTED');
        }
    });
});


//=============== Save Pokemon Info into the DB ==============================//
describe('savePokemonData', () => {
    let upsertStub;

    beforeEach(() => { upsertStub = sinon.stub(Pokemon, 'upsert'); });
    afterEach(() => { upsertStub.restore(); });

    //==============TEST CASE 1: SAVE SUCCESS===============//
    it('This function - savePokemonData - should save pokemon info into the DB.', async () => {
        const transaction = {}; // Mock transaction object
        upsertStub.resolves();
        await savePokemonData(mockPokemonResponse, transaction);

        expect(upsertStub.calledOnce).to.be.true;
        expect(upsertStub.calledWith(mockPokemonResponse, {transaction})).to.be.true;
    });


    //==============TEST CASE 2: DB SAVE ERROR===============//
    it('This function - savePokemonData - should handle errors thrown by Pokemon.upsert', async () => {
        const transaction = {}; // Mock transaction object
        const errorMessage = 'Upsert failed';
        upsertStub.rejects(new Error(errorMessage));

        try {
            await savePokemonData(mockPokemonResponse, transaction);
        } catch (error) {
            expect(error.message).to.equal(errorMessage);
        }

        expect(upsertStub.calledOnce).to.be.true;
    });
})


//============== Format the pokemon details so that it can be inserted into the DB ================//
describe('getPokemonData', () => {
    let fetchPokemonInfoStub;
    let fetchPokemonSpeciesInfoStub;

    beforeEach(() => {
        fetchPokemonInfoStub = sinon.stub(fetchPokemonInfo);
        fetchPokemonSpeciesInfoStub = sinon.stub(fetchPokemonSpeciesInfo);
    });

    afterEach(() => { sinon.restore(); });

    it('This function - getPokemonData - should fetch and process Pokemon data correctly', async () => {
        const pokemon = 'pikachu';
        fetchPokemonInfoStub.resolves(mockPokemonInfo);
        fetchPokemonSpeciesInfoStub.resolves(mockPokemonEvolutionInfo);

        const result = await getPokemonData(pokemon);

        expect(result).to.deep.equal(mockPokemonResponse);
        expect(fetchPokemonInfoStub.calledOnceWith(pokemon)).to.be.true;
        expect(fetchPokemonSpeciesInfoStub.calledOnceWith(mockPokemonInfo.species.url)).to.be.true;
    });


    it('This function - getPokemonData - should handle errors thrown by either fetchPokemonInfo or fetchPokemonSpeciesInfo', async () => {
        const pokemon = 'pikachu';
        fetchPokemonInfoStub.rejects(new Error('Fetch failed')); //need only test for any one of the two fetchPokemonInfo or fetchPokemonSpeciesInfo

        try {
            await getPokemonData(pokemon);
        } catch (error) {
            expect(error.message).to.equal('Fetch failed');
        }

        expect(fetchPokemonInfoStub.calledOnceWith(pokemon)).to.be.true;
    });
});


//============== Main Function test ======================//
describe('savePokemonListFromApi', () => {
    let fetchPokemonListStub;
    let getPokemonDataStub;
    let savePokemonDataStub;
    let transactionStub;

    beforeEach(() => {
        fetchPokemonListStub = sinon.stub(fetchPokemonList);
        getPokemonDataStub = sinon.stub(getPokemonData);
        savePokemonDataStub = sinon.stub(savePokemonData);
        transactionStub = sinon.stub(sequelize, 'transaction');
    });

    afterEach(() => { sinon.restore(); });

    it('This function - savePokemonListFromApi - should fetch a list of pokemon with a specified limit and save pokemon data into the DB successfully', async () => {
        const mockTransaction = { commit: sinon.stub(), rollback: sinon.stub() };
        const limit = 150

        fetchPokemonListStub.resolves(mockPokemonList.results);
        getPokemonDataStub.resolves(mockPokemonResponse);
        savePokemonDataStub.resolves();
        transactionStub.resolves(mockTransaction);

        await savePokemonListFromApi();

        expect(fetchPokemonListStub.calledOnceWith(limit)).to.be.true;
        expect(getPokemonDataStub.calledTwice).to.be.true;
        expect(getPokemonDataStub.firstCall.calledWith('pikachu')).to.be.true;
        expect(getPokemonDataStub.secondCall.calledWith('bulbasaur')).to.be.true;
        expect(savePokemonDataStub.calledTwice).to.be.true;
        expect(savePokemonDataStub.firstCall.calledWith(mockPokemonResponse, mockTransaction)).to.be.true;
        expect(savePokemonDataStub.secondCall.calledWith(mockPokemonResponse, mockTransaction)).to.be.true;
        expect(mockTransaction.commit.calledOnce).to.be.true;
        expect(mockTransaction.rollback.notCalled).to.be.true;
    });

    it('This function - savePokemonListFromApi - should rollback transaction if an error occurs while saving data', async () => {
        const mockTransaction = { commit: sinon.stub(), rollback: sinon.stub() };
        const errorMessage = 'Error saving data';

        fetchPokemonListStub.resolves(mockPokemonList.results);
        getPokemonDataStub.resolves(mockPokemonResponse);
        savePokemonDataStub.rejects(new Error(errorMessage));
        transactionStub.resolves(mockTransaction);

        try {
            await savePokemonListFromApi();
        } catch (error) {
            expect(error.message).to.equal(errorMessage);
        }

        expect(mockTransaction.rollback.calledOnce).to.be.true;
        expect(mockTransaction.commit.notCalled).to.be.true;
    });

    it('This function - savePokemonListFromApi - should handle timeout error when fetching pokemon list', async () => {
        const errorMessage = 'Request timed out';
        fetchPokemonListStub.rejects({ code: 'ECONNABORTED', message: errorMessage });

        const consoleErrorStub = sinon.stub(console, 'error');
        await savePokemonListFromApi();

        expect(consoleErrorStub.calledWith('Request timed out:', errorMessage)).to.be.true;
        consoleErrorStub.restore();
    });

    it('should handle general error when fetching pokemon list', async () => {
        const errorMessage = 'Error while fetching pokemon';
        fetchPokemonListStub.rejects(new Error(errorMessage));

        const consoleErrorStub = sinon.stub(console, 'error');
        await savePokemonListFromApi();

        expect(consoleErrorStub.calledWith('Error fetching while pokemon:', errorMessage)).to.be.true;
        consoleErrorStub.restore();
    });
});
