const express = require("express");
const path = require("path");
const app = express();
const sequelize = require("./config/database");
const session = require("express-session"); // Importa o módulo de sessão
require("dotenv").config(); // Variáveis de ambiente

// Carrega os modelos e as associações
require("./models/associations");

// Middleware para parsing de JSON
app.use(express.json());

// Configuração do express-session
app.use(session({
    secret: "7fc42988d468af3126e3085711f83e26dce596318ffd63c8eb1dc20908bcc68660cc88966837ecb5bef4ea4d78d49de0cec57f51578f6ce452938c80b53b5238", // Chave secreta
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } // Use true se HTTPS
}));

// Função de autenticação (middleware)
function autenticarRequisicao(req, res, next) {
    const urlCpf = req.query.cpf; // Obtém o CPF da URL

    // Verifica se há sessão e se o CPF na sessão corresponde ao da URL
    if (!req.session || !req.session.cpf) {
        console.log("Sessão inválida ou inexistente. Redirecionando...");
        return res.redirect("/"); // Redireciona para a página inicial
    }
    if (req.session.cpf !== urlCpf) {
        console.log("CPF da sessão não corresponde ao CPF da URL. Redirecionando...");
        return res.redirect("/");
    }

    console.log("Usuário autenticado:", req.session.cpf);
    next(); // Continua se autenticado
}

// Servir arquivos estáticos da pasta 'frontend'
app.use(express.static(path.join(__dirname, "frontend")));

// Rotas para páginas principais
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "register.html"));
});

// Protege o acesso ao formulário
app.get("/formulario", autenticarRequisicao, (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "formulario.html"));
});

// Protege o acesso ao visualizar
app.get("/visualiza.html", autenticarRequisicao, (req, res) => {
    console.log("Rota /visualiza.html acessada por CPF:", req.session.cpf);
    res.sendFile(path.join(__dirname, "frontend", "visualiza.html"));
});

// Conexão com o banco de dados e sincronização dos modelos
sequelize
    .authenticate()
    .then(() => {
        console.log("Conectado ao PostgreSQL!");
        return sequelize.sync({ alter: true }); // Sincroniza os modelos com o banco sem recriar as tabelas
    })
    .then(() => console.log("Modelos sincronizados com sucesso!"))
    .catch((err) =>
        console.error("Erro ao conectar ou sincronizar os modelos:", err)
    );

// Rotas de API
const candidatosRoutes = require("./routes/candidatos");
const inscricoesRoutes = require("./routes/inscricoes");
const cargosRoutes = require("./routes/cargos");
const visualizaRouter = require("./routes/visualiza");
const authRoutes = require("./routes/auth");

app.use("/api/candidatos", candidatosRoutes); // Rotas relacionadas a candidatos
app.use("/api/inscricoes", inscricoesRoutes); // Rotas relacionadas a inscrições
app.use("/api/cargos", cargosRoutes); // Rotas relacionadas a cargos
app.use("/api/visualiza", visualizaRouter); // Rotas de visualização
app.use("/api/auth", authRoutes); // Rotas de autenticação

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
