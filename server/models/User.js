import { DataTypes } from "sequelize";
import sequelize from "../config/conn.js";

const User = sequelize.define("User",{
    id:         { type: DataTypes.INTEGER,  autoIncrement: true,    primaryKey: true },
    name:       { type: DataTypes.STRING,   allowNull: false },
    password:   { type: DataTypes.STRING,   allowNull: false },
    email:      { type: DataTypes.STRING,   allowNull: false }
});

export default User;