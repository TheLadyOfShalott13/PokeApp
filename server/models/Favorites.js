import {DataTypes, literal} from "sequelize";
import sequelize from "../config/conn.js";
import User from "./User.js";

const Favorites = sequelize.define("Favorites",{
    id:         { type: DataTypes.INTEGER,  autoIncrement: true,    primaryKey: true },
    poke_id:    { type: DataTypes.INTEGER,   allowNull: false },
    user_id:    { type: DataTypes.INTEGER,   allowNull: false,       references: { model: User, key: 'id' } },
    added_on:   { type: DataTypes.DATE,     allowNull: false,       defaultValue: literal('CURRENT_TIMESTAMP') },
},
{
    indexes: [{
        unique: true,
        fields: ['poke_id', 'user_id']
    }]
});

Favorites.belongsTo(User, { foreignKey: 'user_id' });

export default Favorites;