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
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: "Inscricao",
        tableName: "inscricoes",
        freezeTableName: true,
    }
);

module.exports = Inscricao;
