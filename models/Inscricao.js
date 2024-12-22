const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Inscricao extends Model {}

Inscricao.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        candidato_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cargo_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tempo_servico: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: "inscricao",
        tableName: "inscricoes", // Nome correto da tabela em minúsculas
        freezeTableName: true, // Evita pluralização automática
    }
);

module.exports = Inscricao;
