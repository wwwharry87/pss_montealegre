const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Cargo extends Model {}

Cargo.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        zona: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "cargo",
        tableName: "cargos",
        freezeTableName: true, // Evita pluralização automática
    }
);

module.exports = Cargo;
