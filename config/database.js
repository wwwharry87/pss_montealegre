const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    logging: false, // Ou substitua por `console.log` para ver logs detalhados
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // Necessário para Render
        },
    },
});

module.exports = sequelize;
