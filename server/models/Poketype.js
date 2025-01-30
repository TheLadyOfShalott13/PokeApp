import { DataTypes } from "sequelize";
import sequelize from "../config/conn.js";

const Poketype = sequelize.define("Poketype",{
    id:         { type: DataTypes.INTEGER,  autoIncrement: true,    primaryKey: true },
    name:       { type: DataTypes.STRING,   allowNull: false },
});

export default Poketype;