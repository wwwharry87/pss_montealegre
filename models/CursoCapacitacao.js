const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class CursoCapacitacao extends Model {}

CursoCapacitacao.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
        modelName: "curso_capacitacao",
        tableName: "curso_capacitacao",
        freezeTableName: true, // Evita pluralização automática
    }
);

module.exports = CursoCapacitacao;
