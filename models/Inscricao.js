const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Inscricao = sequelize.define("Inscricao", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    candidato_id: { type: DataTypes.INTEGER, allowNull: false },
    cargo_id: { type: DataTypes.INTEGER, allowNull: false },
    tempo_servico: { 
        type: DataTypes.INTEGER, 
        allowNull: true, 
        validate: { min: 0, max: 10 }
    },
}, { tableName: "inscricoes" });

module.exports = Inscricao;
