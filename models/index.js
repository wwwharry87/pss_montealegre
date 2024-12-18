const { Sequelize } = require("sequelize");
const sequelize = require("../config/database");

// Importação de modelos
const InscricaoModel = require("./Inscricao");
const FormacaoModel = require("./Formacao");
const CursoCapacitacaoModel = require("./CursoCapacitacao");
const CargoModel = require("./Cargo");
const CandidatoModel = require("./Candidato");

// Inicialização dos modelos
const Inscricao = InscricaoModel(sequelize);
const Formacao = FormacaoModel(sequelize);
const CursoCapacitacao = CursoCapacitacaoModel(sequelize);
const Cargo = CargoModel(sequelize);
const Candidato = CandidatoModel(sequelize);

// Associações
Candidato.hasMany(Inscricao, { foreignKey: "candidato_id" });
Inscricao.belongsTo(Candidato, { foreignKey: "candidato_id" });

Cargo.hasMany(Inscricao, { foreignKey: "cargo_id" });
Inscricao.belongsTo(Cargo, { foreignKey: "cargo_id" });

Inscricao.hasMany(Formacao, { foreignKey: "inscricao_id" });
Formacao.belongsTo(Inscricao, { foreignKey: "inscricao_id" });

Inscricao.hasMany(CursoCapacitacao, { foreignKey: "inscricao_id" });
CursoCapacitacao.belongsTo(Inscricao, { foreignKey: "inscricao_id" });

// Exportação dos modelos
module.exports = {
    sequelize,
    Inscricao,
    Formacao,
    CursoCapacitacao,
    Cargo,
    Candidato,
};
