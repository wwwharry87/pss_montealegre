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
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Cargo",
        tableName: "cargos", // Nome da tabela no banco de dados
        timestamps: false,   // Se você não tem colunas createdAt e updatedAt
    }
);

module.exports = Cargo;
