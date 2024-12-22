const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Candidato = require("./Candidato");
const Inscricao = require("./Inscricao");
const Cargo = require("./Cargo");

// Associações
Inscricao.belongsTo(Candidato, { foreignKey: "candidato_id", as: "Candidato" });
Inscricao.belongsTo(Cargo, { foreignKey: "cargo_id", as: "Cargo" });

Candidato.hasMany(Inscricao, { foreignKey: "candidato_id", as: "Inscricoes" });
Cargo.hasMany(Inscricao, { foreignKey: "cargo_id", as: "Inscricoes" });

module.exports = { sequelize, Sequelize, Candidato, Inscricao, Cargo };
