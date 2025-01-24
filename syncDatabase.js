const sequelize = require("./config/database");
const { Candidato, Inscricao, Cargo } = require("./models");

const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true }); // Use { force: true } para recriar tabelas se necessário
        console.log("Modelos sincronizados com sucesso!");
    } catch (error) {
        console.error("Erro ao sincronizar modelos:", error);
    } finally {
        await sequelize.close();
    }
};

syncDatabase();
