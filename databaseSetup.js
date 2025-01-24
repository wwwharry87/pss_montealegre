const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

// Configuração da conexão com o banco de dados
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    logging: console.log, // Ativa log de consultas SQL
});

// Definição do modelo Candidato
const Candidato = sequelize.define("candidato", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cpf: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    rg: DataTypes.STRING,
    dataNascimento: DataTypes.DATEONLY,
    sexo: DataTypes.STRING,
    email: DataTypes.STRING,
    telefone: DataTypes.STRING,
    celular: DataTypes.STRING,
    cep: DataTypes.STRING,
    logradouro: DataTypes.STRING,
    bairro: DataTypes.STRING,
    numero: DataTypes.STRING,
    complemento: DataTypes.STRING,
    estado: DataTypes.STRING,
    municipio: DataTypes.STRING,
});

// Definição do modelo Cargo
const Cargo = sequelize.define("cargo", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    zona: DataTypes.STRING,
});

// Definição do modelo Inscricao
const Inscricao = sequelize.define("inscricao", {
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
});

// Definição do modelo Formacao
const Formacao = sequelize.define("formacao", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false,
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
});

// Definição do modelo CursoCapacitacao
const CursoCapacitacao = sequelize.define("curso_capacitacao", {
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
});

// Associações
Candidato.hasMany(Inscricao, { foreignKey: "candidato_id", as: "inscricoes" });
Inscricao.belongsTo(Candidato, { foreignKey: "candidato_id", as: "candidato" });

Cargo.hasMany(Inscricao, { foreignKey: "cargo_id", as: "inscricoes" });
Inscricao.belongsTo(Cargo, { foreignKey: "cargo_id", as: "cargo" });

Inscricao.hasMany(Formacao, { foreignKey: "inscricao_id", as: "formacoes" });
Formacao.belongsTo(Inscricao, { foreignKey: "inscricao_id", as: "inscricao" });

Inscricao.hasMany(CursoCapacitacao, { foreignKey: "inscricao_id", as: "cursos_capacitacao" });
CursoCapacitacao.belongsTo(Inscricao, { foreignKey: "inscricao_id", as: "inscricao" });

Candidato.hasMany(Formacao, { foreignKey: "candidato_id", as: "formacoes" });
Formacao.belongsTo(Candidato, { foreignKey: "candidato_id", as: "candidato" });

Candidato.hasMany(CursoCapacitacao, { foreignKey: "candidato_id", as: "cursos_capacitacao" });
CursoCapacitacao.belongsTo(Candidato, { foreignKey: "candidato_id", as: "candidato" });

// Sincronizar as tabelas com o banco de dados
(async () => {
    try {
        await sequelize.authenticate();
        console.log("Conexão com o banco de dados estabelecida com sucesso.");

        // Sincronizar explicitamente cada tabela
        await Candidato.sync({ force: true });
        await Cargo.sync({ force: true });
        await Inscricao.sync({ force: true });
        await Formacao.sync({ force: true });
        await CursoCapacitacao.sync({ force: true });

        console.log("Tabelas criadas com sucesso!");
    } catch (error) {
        console.error("Erro ao criar tabelas:", error);
    } finally {
        await sequelize.close();
    }
})();
