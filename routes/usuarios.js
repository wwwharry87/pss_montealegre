const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt'); // Para criptografar senhas
const Usuario = require('../models/Usuario'); // Modelo do Sequelize
const router = express.Router();

// Rota para verificar CPF
router.post('/check-cpf', async (req, res) => {
    const { cpf } = req.body;

    if (!cpf || cpf.length !== 11) {
        return res.status(400).json({ message: 'CPF inválido. Certifique-se de informar 11 dígitos.' });
    }

    try {
        // Verificar se o CPF já existe no banco de dados
        const usuarioExistente = await Usuario.findOne({ where: { cpf } });
        if (usuarioExistente) {
            return res.status(200).json({ exists: true, message: 'CPF já cadastrado.' });
        }

        res.status(200).json({ exists: false, message: 'CPF não cadastrado.' });
    } catch (error) {
        console.error('Erro ao verificar CPF:', error);
        res.status(500).json({ message: 'Erro ao verificar o CPF.' });
    }
});

// Rota para servir o formulário de cadastro
router.get('/formulario', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/formulario.html')); // Ajuste o caminho conforme necessário
});

// Rota para salvar um novo usuário no banco de dados
router.post('/create', async (req, res) => {
    const {
        cpf,
        rg,
        nome,
        dataNascimento,
        sexo,
        email,
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

    // Validação básica dos campos obrigatórios
    if (!cpf || !rg || !nome || !dataNascimento || !sexo || !email || !celular || !cep || !logradouro || !bairro || !numero || !estado || !municipio || !senha) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    try {
        // Criptografar a senha antes de salvar
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        // Criar um novo registro de usuário
        const novoUsuario = await Usuario.create({
            cpf,
            rg,
            nome,
            dataNascimento,
            sexo,
            email,
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

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario: novoUsuario });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'CPF ou Email já cadastrado.' });
        }

        res.status(500).json({ message: 'Erro ao criar usuário.' });
    }
});

module.exports = router;
