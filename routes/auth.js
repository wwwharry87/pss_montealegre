const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Candidato = require("../models/Candidato");

// Configuração de login de administrador (usuário fixo)
const usuarioAdmin = {
    username: "admin",
    password: "admin8718", // Essa senha deve ser armazenada de forma segura (hash) em um ambiente real.
};

// Rota de login para candidatos
router.post("/login", async (req, res) => {
    const { cpf, senha } = req.body;

    try {
        const candidato = await Candidato.findOne({ where: { cpf } });
        if (!candidato) {
            return res.status(404).json({ message: "Candidato não encontrado!" });
        }

        const senhaValida = await bcrypt.compare(senha, candidato.senha);
        if (!senhaValida) {
            return res.status(401).json({ message: "Senha incorreta!" });
        }

        res.status(200).json({ message: "Login realizado com sucesso!" });
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        res.status(500).json({ message: "Erro ao realizar login." });
    }
});

// Rota de login para administrador
router.post("/login-admin", (req, res) => {
    const { username, password } = req.body;

    try {
        if (username === usuarioAdmin.username && password === usuarioAdmin.password) {
            return res.status(200).json({ message: "Login de administrador realizado com sucesso!" });
        } else {
            return res.status(401).json({ message: "Usuário ou senha incorretos." });
        }
    } catch (error) {
        console.error("Erro ao autenticar administrador:", error);
        res.status(500).json({ message: "Erro ao autenticar administrador." });
    }
});

module.exports = router;
