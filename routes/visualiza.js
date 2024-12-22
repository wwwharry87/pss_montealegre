const express = require("express");
const router = express.Router();
const Inscricao = require("../models/Inscricao");
const Cargo = require("../models/Cargo");
const Formacao = require("../models/Formacao");
const CursoCapacitacao = require("../models/CursoCapacitacao");
const Candidato = require("../models/Candidato");

router.get("/:cpf", async (req, res) => {
    const { cpf } = req.params;

    try {
        // Buscar o candidato pelo CPF
        const candidato = await Candidato.findOne({ where: { cpf } });

        if (!candidato) {
            return res.status(404).json({ message: "Candidato não encontrado!" });
        }

        // Buscar todas as inscrições do candidato
        const inscricoes = await Inscricao.findAll({
            where: { candidato_id: candidato.id },
            include: [
                { model: Cargo, as: "cargo", attributes: ["nome", "zona"] },
                { model: Formacao, as: "formacoes", attributes: ["tipo", "instituicao", "curso", "periodo", "carga_horaria"] },
                { model: CursoCapacitacao, as: "cursosCapacitacao", attributes: ["instituicao", "curso", "periodo", "carga_horaria"] },
            ],
            order: [["createdAt", "ASC"]], // Ordenar pela data de criação
        });

        // Adicionar numeração às inscrições
        const inscricoesComNumeracao = inscricoes.map((inscricao, index) => ({
            numero: `${index + 1}ª Inscrição`,
            id: inscricao.id,
            tempo_servico: inscricao.tempo_servico,
            createdAt: inscricao.createdAt, // Data e hora da inscrição
            cargo: inscricao.cargo,
            formacoes: inscricao.formacoes,
            cursosCapacitacao: inscricao.cursosCapacitacao,
        }));

        // Retornar os dados do candidato junto com suas inscrições
        res.status(200).json({
            candidato: { nome: candidato.nome, cpf: candidato.cpf },
            inscricoes: inscricoesComNumeracao,
        });
    } catch (error) {
        console.error("Erro ao buscar inscrições:", error);
        res.status(500).json({ message: "Erro ao buscar inscrições.", error: error.message });
    }
});

module.exports = router;
