const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const router = express.Router();
const Candidato = require("../models/Candidato");

// Verificar se o CPF já está cadastrado
router.post("/check-cpf", async (req, res) => {
    const { cpf } = req.body;

    if (!cpf || cpf.length !== 11) {
        return res.status(400).json({ message: "CPF inválido. Certifique-se de informar 11 dígitos." });
    }

    try {
        const candidatoExistente = await Candidato.findOne({ where: { cpf } });
        if (candidatoExistente) {
            return res.status(200).json({ exists: true, message: "CPF já cadastrado." });
        }
        res.status(200).json({ exists: false, message: "CPF não cadastrado." });
    } catch (error) {
        console.error("Erro ao verificar CPF:", error);
        res.status(500).json({ message: "Erro ao verificar o CPF." });
    }
});

// Rota para servir o formulário com o CPF
router.get("/formulario", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/formulario.html"));
});

// Criar um novo candidato
router.post("/create", async (req, res) => {
    const {
        cpf,
        nome,
        rg,
        email,
        dataNascimento,
        sexo,
        telefone,
        celular,
        cep,
        logradouro,
        bairro,
        numero,
        complemento,
        estado,
        municipio,
        senha,
    } = req.body;

    // Validação simples para campos obrigatórios
    if (!cpf || !nome || !rg || !email || !dataNascimento || !sexo || !celular || !cep || !logradouro || !bairro || !numero || !estado || !municipio || !senha) {
        return res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos." });
    }

    try {
        // Verificar se o CPF já existe
        const candidatoExistente = await Candidato.findOne({ where: { cpf } });
        if (candidatoExistente) {
            return res.status(400).json({ message: "CPF já cadastrado no sistema." });
        }

        // Criptografar a senha
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        // Criar novo candidato
        const novoCandidato = await Candidato.create({
            cpf,
            nome,
            rg,
            email,
            dataNascimento,
            sexo,
            telefone,
            celular,
            cep,
            logradouro,
            bairro,
            numero,
            complemento,
            estado,
            municipio,
            senha: senhaCriptografada,
        });

        res.status(201).json({ message: "Candidato cadastrado com sucesso!", candidato: novoCandidato });
    } catch (error) {
        console.error("Erro ao criar candidato:", error);
        res.status(500).json({ message: "Erro ao criar candidato." });
    }
});

module.exports = router;
