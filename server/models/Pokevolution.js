import { DataTypes } from "sequelize";
import sequelize from "../config/conn.js";
import Pokemon from "./Pokemon.js";

const Pokevolution = sequelize.define("Pokevolution",{
    id:           { type: DataTypes.INTEGER,  autoIncrement: true,    primaryKey: true },
    pokechain_id: { type: DataTypes.INTEGER,  allowNull: false },
    position:     { type: DataTypes.INTEGER,  allowNull: false },
    pokemon_id:   { type: DataTypes.INTEGER,  allowNull: false,       references: { model: Pokemon, key: 'id' } },
    method:       { type: DataTypes.STRING,   allowNull: false },
});

Pokevolution.belongsTo(Pokemon, { foreignKey: 'pokemon_id' });

export default Pokevolution;