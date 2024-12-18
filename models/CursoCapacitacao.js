const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CursoCapacitacao = sequelize.define("CursoCapacitacao", {
    periodo: { type: DataTypes.STRING, allowNull: false },
    carga_horaria: { type: DataTypes.INTEGER, allowNull: false },
    inscricao_id: { type: DataTypes.INTEGER, allowNull: true },
    candidato_id: { type: DataTypes.INTEGER, allowNull: true } // Adicionado
});

// Relacionamento
CursoCapacitacao.associate = (models) => {
    CursoCapacitacao.belongsTo(models.Candidato, { foreignKey: "candidato_id", as: "Candidato" });
};

module.exports = CursoCapacitacao;
