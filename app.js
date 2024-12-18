const express = require('express');
const path = require('path');
const app = express();
const sequelize = require('./config/database');

const candidatosRoutes = require('./routes/candidatos');

const inscricoesRoutes = require("./routes/inscricoes");

const cargosRoutes = require("./routes/cargos");


require("dotenv").config(); // Variáveis de ambiente

// Middleware para parsing de JSON
app.use(express.json());

// Servir arquivos estáticos da pasta 'frontend'
app.use(express.static(path.join(__dirname, "frontend"))); // Serve all static files from 'frontend'

// Rotas principais
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "register.html")); // Página inicial de registro
});

app.get("/formulario", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "formulario.html")); // Página de formulário
});

// Conexão com o banco de dados e sincronização dos modelos
sequelize
    .authenticate()
    .then(() => {
        console.log("Conectado ao PostgreSQL!");

        // Sincroniza os modelos com o banco de dados
        return sequelize.sync({ alter: true }); // Ajusta a estrutura das tabelas sem recriá-las
    })
    .then(() => console.log("Modelos sincronizados com sucesso!"))
    .catch((err) => console.error("Erro ao conectar ou sincronizar os modelos:", err));

// Rotas
app.use("/api/candidatos", candidatosRoutes); // Rotas relacionadas aos candidatos

// Rotas
app.use("/api/inscricoes", inscricoesRoutes);

//Rotas
app.use("/api/cargos", cargosRoutes); // Nova rota para cargos

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
