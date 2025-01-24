const Candidato = require('./Candidato');
const Inscricao = require('./Inscricao');
const Cargo = require('./Cargo');
const Formacao = require('./Formacao');
const CursoCapacitacao = require('./CursoCapacitacao');
const Resultados = require('./Resultados');

// Configurando as associações
function setupAssociations() {
    // Associações entre Inscricao e Cargo
    Inscricao.belongsTo(Cargo, { foreignKey: "cargo_id", as: "cargo" });
    Cargo.hasMany(Inscricao, { foreignKey: "cargo_id", as: "inscricoes" });

    // Associações entre Inscricao e Candidato
    Inscricao.belongsTo(Candidato, { foreignKey: "candidato_id", as: "candidato" });
    Candidato.hasMany(Inscricao, { foreignKey: "candidato_id", as: "inscricoes" });

    // Associações entre Inscricao e Formacao
    Inscricao.hasMany(Formacao, { foreignKey: "inscricao_id", as: "formacoes" });
    Formacao.belongsTo(Inscricao, { foreignKey: "inscricao_id", as: "inscricao" });

    // Associações entre Inscricao e CursoCapacitacao
    Inscricao.hasMany(CursoCapacitacao, { foreignKey: "inscricao_id", as: "cursosCapacitacao" });
    CursoCapacitacao.belongsTo(Inscricao, { foreignKey: "inscricao_id", as: "inscricao" });

    // Associações entre Candidato e Formacao
    Candidato.hasMany(Formacao, { foreignKey: "candidato_id", as: "formacoes" });
    Formacao.belongsTo(Candidato, { foreignKey: "candidato_id", as: "candidato" });

    // Associações entre Candidato e CursoCapacitacao
    Candidato.hasMany(CursoCapacitacao, { foreignKey: "candidato_id", as: "cursosCapacitacao" });
    CursoCapacitacao.belongsTo(Candidato, { foreignKey: "candidato_id", as: "candidato" });

    // Associações entre Resultados e Inscricao
    Resultados.belongsTo(Inscricao, { foreignKey: "inscricao_id", as: "inscricao" });
    Inscricao.hasOne(Resultados, { foreignKey: "inscricao_id", as: "resultado" });
}

// Exportar os modelos e a função de configuração
module.exports = {
    Candidato,
    Inscricao,
    Cargo,
    Formacao,
    CursoCapacitacao,
    Resultados,
    setupAssociations,
};
