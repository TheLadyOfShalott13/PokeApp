import {DataTypes} from "sequelize";
import sequelize from "../config/conn.js";

const Pokemon = sequelize.define("Pokemon",{
        id:         { type: DataTypes.INTEGER,  autoIncrement: true,    primaryKey: true },
        name:       { type: DataTypes.STRING,   allowNull: false },
        identifier: { type: DataTypes.INTEGER,  allowNull: false },
        slug:       { type: DataTypes.STRING,   allowNull: false },
        image_path: { type: DataTypes.DATE,     allowNull: false },
        poketypes:  { type: DataTypes.STRING,   allowNull: false }      //instead of a separate table, keep multiple IDs as a string separated with commas
    });

export default Pokemon;