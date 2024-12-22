const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Formacao extends Model {}

Formacao.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        instituicao: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        curso: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        periodo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        carga_horaria: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "formacao",
        tableName: "formacoes",
        freezeTableName: true, // Evita pluralização automática
    }
);

module.exports = Formacao;
