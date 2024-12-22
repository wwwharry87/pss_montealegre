// Importar os modelos
const Candidato = require("./Candidato");
const Inscricao = require("./Inscricao");
const Cargo = require("./Cargo");
const Formacao = require("./Formacao");
const CursoCapacitacao = require("./CursoCapacitacao");

// Associações
Candidato.hasMany(Inscricao, { foreignKey: "candidato_id", as: "inscricoes" });
Inscricao.belongsTo(Candidato, { foreignKey: "candidato_id", as: "candidato" });

Cargo.hasMany(Inscricao, { foreignKey: "cargo_id", as: "inscricoes" });
Inscricao.belongsTo(Cargo, { foreignKey: "cargo_id", as: "cargo" });

Inscricao.hasMany(Formacao, { foreignKey: "inscricao_id", as: "formacoes" });
Formacao.belongsTo(Inscricao, { foreignKey: "inscricao_id", as: "inscricao" });

Inscricao.hasMany(CursoCapacitacao, { foreignKey: "inscricao_id", as: "cursosCapacitacao" });
CursoCapacitacao.belongsTo(Inscricao, { foreignKey: "inscricao_id", as: "inscricao" });

Candidato.hasMany(Formacao, { foreignKey: "candidato_id", as: "formacoes" });
Formacao.belongsTo(Candidato, { foreignKey: "candidato_id", as: "candidato" });

Candidato.hasMany(CursoCapacitacao, { foreignKey: "candidato_id", as: "cursosCapacitacao" });
CursoCapacitacao.belongsTo(Candidato, { foreignKey: "candidato_id", as: "candidato" });

// Exportar os modelos e associações
module.exports = {
  Candidato,
  Inscricao,
  Cargo,
  Formacao,
  CursoCapacitacao,
};
