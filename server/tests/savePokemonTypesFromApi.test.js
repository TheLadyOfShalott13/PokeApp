//=============Set up all test tools================//
import * as chai from "chai";
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import sequelize from '../config/conn.js';

//============import object and functions to be tested and assertion objects===========//
import {savePokemonTypesFromApi} from '../controllers/pokeapi.js';
import Poketype from '../models/Poketype.js';
import {expect} from 'chai';

chai.use(sinonChai);

describe('savePokemonTypesFromApi', () => {
    let axiosMock;
    let transactionStub;
    let upsertStub;

    const pokeapi_pokemon_types_url = 'https://pokeapi.co/api/v2/type'

    beforeEach(() => {
        axiosMock = new MockAdapter(axios);                         // Mock Axios
        transactionStub = sinon.stub(sequelize, 'transaction');     // Stub Sequelize transaction and upsert
        upsertStub = sinon.stub(Poketype, 'upsert');
    });

    afterEach(() => {
        axiosMock.restore();
        transactionStub.restore();
        upsertStub.restore();
    });

    //==============TEST CASE 1: SAVE SUCCESS===============//
    it('This function should fetch pokemon types from pokeapi and save {id,name} into the DB.', async () => {
        
        const testPokemonTypes = [
            { name: 'fire', url: 'https://pokeapi.co/api/v2/type/10/' },
            { name: 'water', url: 'https://pokeapi.co/api/v2/type/11/' }
        ];

        axiosMock.onGet(pokeapi_pokemon_types_url).reply(200, { results: testPokemonTypes });
        const commitStub = sinon.stub();
        const rollbackStub = sinon.stub();

        transactionStub.resolves({
            commit: commitStub,
            rollback: rollbackStub
        });

        await savePokemonTypesFromApi();

        expect(upsertStub).to.have.been.calledTwice;
        expect(upsertStub).to.have.been.calledWith({ id: '10', name: 'fire' }, { transaction: sinon.match.any });
        expect(upsertStub).to.have.been.calledWith({ id: '11', name: 'water' }, { transaction: sinon.match.any });
        expect(commitStub).to.have.been.calledOnce;
        expect(rollbackStub).not.to.have.been.called;
    });


    //==============TEST CASE 2: POKE API GIVES TIMEOUT ERROR===============//
    it('This function should handle timeout requests correctly.', async () => {
        axiosMock.onGet(pokeapi_pokemon_types_url).timeout();

        await savePokemonTypesFromApi();

        expect(transactionStub).not.to.have.been.called;
        expect(upsertStub).not.to.have.been.called;
    });


    //==============TEST CASE 3: DB SAVE ERROR===============//
    it('should rollback transaction on error', async () => {
        const testPokemonTypes = [
            { name: 'fire', url: 'https://pokeapi.co/api/v2/type/10/' }
        ];

        axiosMock.onGet(pokeapi_pokemon_types_url).reply(200, { results: testPokemonTypes });
        const commitStub = sinon.stub();
        const rollbackStub = sinon.stub();

        transactionStub.resolves({
            commit: commitStub,
            rollback: rollbackStub
        });

        upsertStub.rejects(new Error('Problem while saving into the DB.'));

        try {
            await savePokemonTypesFromApi();
        } catch (error) {
            expect(error.message).to.equal('Problem while saving into the DB.');
        }

        expect(upsertStub).to.have.been.calledOnce;
        expect(commitStub).not.to.have.been.called;
        expect(rollbackStub).to.have.been.calledOnce;
    });
});
