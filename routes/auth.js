const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Candidato = require("../models/Candidato");
const Token = require("../models/Token");

const usuarioAdmin = {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "admin8718",
};

router.post("/login", async (req, res) => {
    const { cpf, senha } = req.body;

    try {
        const candidato = await Candidato.findOne({ where: { cpf } });
        if (!candidato) {
            return res.status(404).json({ success: false, message: "Candidato não encontrado!" });
        }

        const senhaValida = await bcrypt.compare(senha, candidato.senha);
        if (!senhaValida) {
            return res.status(401).json({ success: false, message: "Senha incorreta!" });
        }

        res.status(200).json({ success: true, message: "Login realizado com sucesso!" });
    } catch (error) {
        console.error("Erro ao fazer login:", error.message);
        res.status(500).json({ success: false, message: "Erro ao realizar login." });
    }
});

router.post("/login-admin", (req, res) => {
    const { username, password } = req.body;

    try {
        if (username === usuarioAdmin.username && password === usuarioAdmin.password) {
            return res.status(200).json({ success: true, message: "Login de administrador realizado com sucesso!" });
        } else {
            return res.status(401).json({ success: false, message: "Usuário ou senha incorretos." });
        }
    } catch (error) {
        console.error("Erro ao autenticar administrador:", error.message);
        res.status(500).json({ success: false, message: "Erro ao autenticar administrador." });
    }
});

router.post("/auth/recover", async (req, res) => {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, message: "E-mail inválido." });
    }

    try {
        const candidato = await Candidato.findOne({ where: { email } });
        if (!candidato) {
            return res.status(404).json({ success: false, message: "E-mail não encontrado." });
        }

        const token = crypto.randomBytes(32).toString("hex");

        await Token.create({
            candidatoId: candidato.id,
            token,
            expiresAt: new Date(Date.now() + 3600000),
        });

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetLink = `${process.env.FRONTEND_URL}/redefinir-senha?token=${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Redefinição de Senha",
            text: `Olá, ${candidato.nome}. Clique no link abaixo para redefinir sua senha:\n\n${resetLink}`,
        });

        res.status(200).json({ success: true, message: "E-mail de redefinição enviado com sucesso." });
    } catch (error) {
        console.error("Erro ao enviar e-mail de redefinição:", error.message);
        res.status(500).json({ success: false, message: "Erro ao enviar e-mail de redefinição." });
    }
});

router.post("/auth/reset", async (req, res) => {
    const { token, novaSenha } = req.body;

    if (!novaSenha || novaSenha.length < 8) {
        return res.status(400).json({ success: false, message: "A senha deve ter pelo menos 8 caracteres." });
    }

    try {
        const tokenEntry = await Token.findOne({ where: { token } });
        if (!tokenEntry || tokenEntry.expiresAt < new Date()) {
            return res.status(400).json({ success: false, message: "Token inválido ou expirado." });
        }

        const hashSenha = await bcrypt.hash(novaSenha, 10);
        await Candidato.update({ senha: hashSenha }, { where: { id: tokenEntry.candidatoId } });
        await Token.destroy({ where: { id: tokenEntry.id } });

        res.status(200).json({ success: true, message: "Senha redefinida com sucesso." });
    } catch (error) {
        console.error("Erro ao redefinir senha:", error.message);
        res.status(500).json({ success: false, message: "Erro ao redefinir senha." });
    }
});

// Rota para validar dados do candidato e redefinir senha
router.post("/auth/validate-reset", async (req, res) => {
    const { cpf, nomeCompleto, dataNascimento } = req.body;

    try {
        // Busca o candidato pelo CPF
        const candidato = await Candidato.findOne({ where: { cpf } });
        if (!candidato) {
            return res.status(404).json({ message: "Candidato não encontrado." });
        }

        // Valida nome completo e data de nascimento
        if (
            candidato.nome.toLowerCase() !== nomeCompleto.toLowerCase() ||
            candidato.dataNascimento !== dataNascimento
        ) {
            return res.status(400).json({ message: "Dados do candidato incorretos." });
        }

        // Gera a nova senha
        const primeiroNome = candidato.nome.split(" ")[0];
        const primeirosNumerosCPF = candidato.cpf.slice(0, 3);
        const novaSenha = `${primeiroNome}${primeirosNumerosCPF}`;

        // Atualiza a senha no banco (hash)
        const hashSenha = await bcrypt.hash(novaSenha, 10);
        await Candidato.update({ senha: hashSenha }, { where: { id: candidato.id } });

        // Retorna a nova senha
        res.status(200).json({ novaSenha });
    } catch (error) {
        console.error("Erro ao redefinir senha:", error);
        res.status(500).json({ message: "Erro ao redefinir senha. Tente novamente mais tarde." });
    }
});

module.exports = router;
