const sequelize = require("./config/database");
const Formacao = require("./models/Formacao");
const CursoCapacitacao = require("./models/CursoCapacitacao");

sequelize
    .sync({ alter: true }) // Atualiza as tabelas sem perder dados
    .then(() => console.log("Tabelas sincronizadas com sucesso!"))
    .catch((error) => console.error("Erro ao sincronizar tabelas:", error));
