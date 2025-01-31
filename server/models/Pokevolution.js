import {DataTypes} from "sequelize";
import sequelize from "../config/conn.js";
import Pokemon from "./Pokemon.js";

const Pokevolution = sequelize.define("Pokevolution",{
    id:           { type: DataTypes.INTEGER,  autoIncrement: true,    primaryKey: true },
    pokechain_id: { type: DataTypes.INTEGER,  allowNull: false },                                                   //evolution chain id from pokeAPI
    position:     { type: DataTypes.INTEGER,  allowNull: false,       defaultValue: 1 },                            //position of pokemon in evolution chain (default value 1)
    pokemon_id:   { type: DataTypes.INTEGER,  allowNull: false,       references: { model: Pokemon, key: 'id' } },  //id from pokemon model
    method:       { type: DataTypes.STRING,   allowNull: false,       defaultValue: 'level-up' },      //unless specified, this takes default value as "level-up"
    item:         { type: DataTypes.STRING,   allowNull: true },                                                    //item used for evolution method, stays null by default
});

Pokevolution.belongsTo(Pokemon, { foreignKey: 'pokemon_id' });

export default Pokevolution;