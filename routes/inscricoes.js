const express = require("express");
const router = express.Router();
const { Sequelize } = require("sequelize");

// Importação correta dos modelos
const Inscricao = require("../models/Inscricao");
const Formacao = require("../models/Formacao");
const CursoCapacitacao = require("../models/CursoCapacitacao");
const Cargo = require("../models/Cargo");
const Candidato = require("../models/Candidato");

// Rota para buscar cargos pela zona
router.get("/cargos", async (req, res) => {
    const { zona } = req.query;

    if (!zona) {
        return res.status(400).json({ message: "Zona não especificada." });
    }

    try {
        console.log("Buscando cargos para a zona:", zona);

        const cargos = await Cargo.findAll({
            where: Sequelize.where(
                Sequelize.fn("TRIM", Sequelize.col("zona")),
                zona.trim().toUpperCase()
            ),
        });

        console.log("Cargos encontrados:", cargos);
        res.status(200).json(cargos);
    } catch (error) {
        console.error("Erro ao buscar cargos:", error);
        res.status(500).json({ message: "Erro ao buscar cargos.", error: error.message });
    }
});

// Rota para criar uma nova inscrição usando CPF
router.post("/create", async (req, res) => {
    const { cpf, cargo_id, tempo_servico, formacoes, cursos_capacitacao } = req.body;

    if (!cpf || !cargo_id) {
        return res.status(400).json({ message: "CPF e cargo são obrigatórios!" });
    }

    try {
        // Buscar o candidato pelo CPF
        const candidato = await Candidato.findOne({ where: { cpf } });

        if (!candidato) {
            return res.status(404).json({ message: "Candidato não encontrado!" });
        }

        // Criar a inscrição principal associada ao candidato encontrado
        const novaInscricao = await Inscricao.create({
            candidato_id: candidato.id,
            cargo_id,
            tempo_servico: tempo_servico || 0
        });

        // Salvar as formações associadas (até 3 registros)
        if (Array.isArray(formacoes) && formacoes.length > 0) {
            const formacoesComId = formacoes
                .slice(0, 3) // Limitar a 3 formações
                .map(f => ({
                    ...f,
                    inscricao_id: novaInscricao.id,
                    candidato_id: candidato.id // Adiciona candidato_id aqui
                }));
            await Formacao.bulkCreate(formacoesComId);
        }

        // Salvar os cursos de capacitação associados (até 10 registros)
        if (Array.isArray(cursos_capacitacao) && cursos_capacitacao.length > 0) {
            const cursosComId = cursos_capacitacao
                .slice(0, 10) // Limitar a 10 cursos
                .map(c => ({
                    ...c,
                    inscricao_id: novaInscricao.id,
                    candidato_id: candidato.id // Adiciona candidato_id aqui
                }));
            await CursoCapacitacao.bulkCreate(cursosComId);
        }

        res.status(201).json({ message: "Inscrição realizada com sucesso!", inscricao: novaInscricao });
    } catch (error) {
        console.error("Erro ao criar inscrição:", error);
        res.status(500).json({ message: "Erro ao criar a inscrição.", error: error.message });
    }
});


// Rota para listar todas as inscrições com informações do candidato
router.get("/", async (req, res) => {
    try {
        const inscricoes = await Inscricao.findAll({
            include: [
                { model: Candidato, attributes: ["id", "nome", "cpf"] },
                { model: Cargo, attributes: ["nome", "zona"] }
            ]
        });

        res.status(200).json(inscricoes);
    } catch (error) {
        console.error("Erro ao buscar inscrições:", error);
        res.status(500).json({ message: "Erro ao buscar as inscrições." });
    }
});

// Rota para buscar inscrições de um candidato específico (por CPF)
router.get("/:cpf", async (req, res) => {
    const { cpf } = req.params;

    try {
        const candidato = await Candidato.findOne({ where: { cpf } });

        if (!candidato) {
            return res.status(404).json({ message: "Candidato não encontrado!" });
        }

        const inscricoes = await Inscricao.findAll({
            where: { candidato_id: candidato.id },
            include: [
                { model: Cargo, attributes: ["nome", "zona"] },
                { model: Formacao, attributes: ["tipo", "periodo", "carga_horaria"] },
                { model: CursoCapacitacao, attributes: ["periodo", "carga_horaria"] }
            ]
        });

        res.status(200).json(inscricoes);
    } catch (error) {
        console.error("Erro ao buscar inscrições:", error);
        res.status(500).json({ message: "Erro ao buscar as inscrições." });
    }
});

module.exports = router;