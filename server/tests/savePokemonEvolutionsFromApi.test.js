//=============Set up all test tools================//
import * as chai from "chai";
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import axios from 'axios';
import sequelize from '../config/conn.js';

//============import object and functions to be tested and assertion objects===========//
import {
    savePokemonEvolutionsFromApi,
    processEvolvedTo
} from '../controllers/pokeapi.js';
import Pokemon from '../models/Pokemon.js';
import Pokevolution from '../models/Pokevolution.js';
import {expect} from 'chai';

chai.use(sinonChai);

//================= Some common test mocks =====================//
const mockPokemonEvolutionResponse = {
    "chain": {
        "evolution_details": [],
        "evolves_to": [
            {
                "evolution_details": [
                    {
                        "trigger": { "name": "level-up", "url": "https://pokeapi.co/api/v2/evolution-trigger/1/" }
                    }
                ],
                "evolves_to": [
                    {
                        "evolution_details": [
                            {
                                "trigger": { "name": "use-item", "url": "https://pokeapi.co/api/v2/evolution-trigger/3/" }
                            }
                        ],
                        "evolves_to": [],
                        "species": { "name": "raichu", "url": "https://pokeapi.co/api/v2/pokemon-species/26/" }
                    }
                ],
                "species": { "name": "pikachu", "url": "https://pokeapi.co/api/v2/pokemon-species/25/" }
            }
        ],
        "species": { "name": "pichu", "url": "https://pokeapi.co/api/v2/pokemon-species/172/" }
    }
}

const mockPokemonIdentifierMap = { 'pichu' : 1, 'pikachu' : 2, 'raichu' : 3 }

const mockPokemonData = [
    { id: 1, slug: 'pichu', pokechain_id: '10' },
    { id: 2, slug: 'pikachu', pokechain_id: '10' },
    { id: 3, slug: 'raichu', pokechain_id: '10' }
];


//================= Function to process the pokemon evolution =======================//
describe('processEvolvedTo', () => {
    let upsertStub;
    let mockTransaction;

    beforeEach(() => {
        upsertStub = sinon.stub(Pokevolution, 'upsert');
        mockTransaction = { commit: sinon.stub(), rollback: sinon.stub() };
    });

    afterEach(() => { sinon.restore(); });

    it('This function - processEvolvedTo - should process and save evolution details into DB', async () => {
        const evolution_chain_id = 10;
        const position = 1;
        await processEvolvedTo(
            evolution_chain_id,
            position,
            mockPokemonEvolutionResponse.chain,
            mockPokemonIdentifierMap,
            mockTransaction
        );

        expect(upsertStub).to.have.been.calledTwice;
        expect(upsertStub.firstCall).to.have.been.calledWith({
            pokechain_id:   evolution_chain_id,
            position:       position,
            pokemon_id:     1,
            ways:           0
        }, { transaction: mockTransaction });
        expect(upsertStub.secondCall).to.have.been.calledWith({
            pokechain_id:   evolution_chain_id,
            position:       position+1,
            pokemon_id:     2,
            ways:           1
        }, { transaction: mockTransaction });
        expect(upsertStub.secondCall).to.have.been.calledWith({
            pokechain_id:   evolution_chain_id,
            position:       position+2,
            pokemon_id:     3,
            ways:           1
        }, { transaction: mockTransaction });
    });

    it('This function - processEvolvedTo - should handle errors during processing pokemon evolution details', async () => {
        const evolution_chain_id = 10;
        const position = 1;
        const errorMessage = 'Error while saving pokemon evolution details';
        upsertStub.rejects(new Error(errorMessage));
        try {
            await processEvolvedTo(
                evolution_chain_id,
                position,
                mockPokemonEvolutionResponse.chain,
                mockPokemonIdentifierMap,
                mockTransaction
            );
        } catch (error) {
            expect(error.message).to.equal(errorMessage);
        }

        expect(upsertStub).to.have.been.calledOnce;
    });
});


//================= Function to fetch pokemon evolution details and send it for processing =======================//
describe('savePokemonEvolutionsFromApi', () => {
    let axiosGetStub;
    let findAllStub;
    let transactionStub;
    let upsertStub;

    beforeEach(() => {
        axiosGetStub = sinon.stub(axios, 'get');
        findAllStub = sinon.stub(Pokemon, 'findAll');
        transactionStub = sinon.stub(sequelize, 'transaction');
        upsertStub = sinon.stub(Pokevolution, 'upsert');
    });

    afterEach(() => { sinon.restore(); });


    it('This function - savePokemonEvolutionsFromApi - should process and save pokemon evolutions into the DB correctly', async () => {
        const mockTransaction = { commit: sinon.stub(), rollback: sinon.stub() };

        findAllStub.resolves(mockPokemonData);
        axiosGetStub.resolves({ data: mockPokemonEvolutionResponse });
        transactionStub.resolves(mockTransaction);
        upsertStub.resolves();

        await savePokemonEvolutionsFromApi();

        expect(findAllStub).to.have.been.calledOnce;
        expect(axiosGetStub).to.have.been.calledOnce;
        expect(transactionStub).to.have.been.calledOnce;
        expect(upsertStub).to.have.been.calledThrice;
        expect(mockTransaction.commit).to.have.been.calledOnce;
        expect(mockTransaction.rollback).to.not.have.been.called;
    });


    it('This function - savePokemonEvolutionsFromApi - should rollback transaction if an error occurs while saving evolution details into the DB', async () => {
        const mockTransaction = { commit: sinon.stub(), rollback: sinon.stub() };
        const errorMessage = 'Error while saving evolution data';

        findAllStub.resolves(mockPokemonData);
        axiosGetStub.rejects(new Error(errorMessage));
        transactionStub.resolves(mockTransaction);

        try {
            await savePokemonEvolutionsFromApi();
        } catch (error) {
            expect(error.message).to.equal(errorMessage);
        }

        expect(mockTransaction.rollback).to.have.been.calledOnce;
        expect(mockTransaction.commit).to.not.have.been.called;
    });


    it('This function - savePokemonEvolutionsFromApi - should handle errors when fetching pokemon info from the DB', async () => {
        const errorMessage = 'Error fetching Pokémon evolution map from the poke API';
        findAllStub.rejects(new Error(errorMessage));
        const consoleErrorStub = sinon.stub(console, 'error');

        await savePokemonEvolutionsFromApi();

        expect(consoleErrorStub).to.have.been.calledWith('Error fetching Pokémon data from the DB:', errorMessage);
        consoleErrorStub.restore();
    });
});