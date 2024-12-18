const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Formacao = sequelize.define("Formacao", {
    tipo: { type: DataTypes.STRING, allowNull: false },
    periodo: { type: DataTypes.STRING, allowNull: false },
    carga_horaria: { type: DataTypes.INTEGER, allowNull: false },
    inscricao_id: { type: DataTypes.INTEGER, allowNull: true },
    candidato_id: { type: DataTypes.INTEGER, allowNull: true } // Adicionado
});

// Relacionamento
Formacao.associate = (models) => {
    Formacao.belongsTo(models.Candidato, { foreignKey: "candidato_id", as: "Candidato" });
};

module.exports = Formacao;
