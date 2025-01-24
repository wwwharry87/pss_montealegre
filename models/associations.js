// Importar os modelos
const Candidato = require("./Candidato");
const Inscricao = require("./Inscricao");
const Cargo = require("./Cargo");
const Formacao = require("./Formacao");
const CursoCapacitacao = require("./CursoCapacitacao");
const Resultados = require("./Resultados");

// Associações entre Candidato e Inscrição
Candidato.hasMany(Inscricao, { foreignKey: "candidato_id", as: "inscricoes" });
Inscricao.belongsTo(Candidato, { foreignKey: "candidato_id", as: "candidato" });

// Associações entre Cargo e Inscrição
Cargo.hasMany(Inscricao, { foreignKey: "cargo_id", as: "inscricoes" });
Inscricao.belongsTo(Cargo, { foreignKey: "cargo_id", as: "cargo" });

// Associações entre Inscrição e Formação
Inscricao.hasMany(Formacao, { foreignKey: "inscricao_id", as: "formacoes" });
Formacao.belongsTo(Inscricao, { foreignKey: "inscricao_id", as: "inscricao" });

// Associações entre Inscrição e Curso de Capacitação
Inscricao.hasMany(CursoCapacitacao, { foreignKey: "inscricao_id", as: "cursosCapacitacao" });
CursoCapacitacao.belongsTo(Inscricao, { foreignKey: "inscricao_id", as: "inscricao" });

// Associações entre Candidato e Formação
Candidato.hasMany(Formacao, { foreignKey: "candidato_id", as: "formacoes" });
Formacao.belongsTo(Candidato, { foreignKey: "candidato_id", as: "candidato" });

// Associações entre Candidato e Curso de Capacitação
Candidato.hasMany(CursoCapacitacao, { foreignKey: "candidato_id", as: "cursosCapacitacao" });
CursoCapacitacao.belongsTo(Candidato, { foreignKey: "candidato_id", as: "candidato" });

// Associações necessárias
Inscricao.hasOne(Resultados, { foreignKey: "inscricao_id", as: "resultado" });
Resultados.belongsTo(Inscricao, { foreignKey: "inscricao_id", as: "inscricao" });

Candidato.hasMany(Resultados, { foreignKey: "candidato_id", as: "resultados" });
Resultados.belongsTo(Candidato, { foreignKey: "candidato_id", as: "candidato" });

module.exports = {
  Candidato,
  Inscricao,
  Cargo,
  Formacao,
  CursoCapacitacao,
  Resultados,
};

