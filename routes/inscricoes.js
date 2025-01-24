const express = require("express");
const router = express.Router();
const { Sequelize } = require("sequelize");

// Importação correta dos modelos
const Inscricao = require("../models/Inscricao");
const Formacao = require("../models/Formacao");
const CursoCapacitacao = require("../models/CursoCapacitacao");
const Cargo = require("../models/Cargo");
const Candidato = require("../models/Candidato");

// Rota para criar uma nova inscrição usando CPF
router.post("/create", async (req, res) => {
    try {
        console.log("Dados recebidos no backend:", req.body);

        const { cpf, cargo_id, tempo_servico, formacoes, cursos_capacitacao } = req.body;

        if (!cpf || !cargo_id) {
            return res.status(400).json({ message: "CPF e cargo são obrigatórios!" });
        }

        // Buscar candidato
        const candidato = await Candidato.findOne({ where: { cpf } });
        if (!candidato) {
            return res.status(404).json({ message: "Candidato não encontrado!" });
        }

        console.log("Candidato encontrado:", candidato);

        // Verificar se já existe uma inscrição para o mesmo cargo
        const inscricaoExistente = await Inscricao.findOne({
            where: {
                candidato_id: candidato.id,
                cargo_id: cargo_id
            }
        });

        if (inscricaoExistente) {
            return res.status(400).json({
                message: "Você já está inscrito neste cargo!"
            });
        }

        // Criar inscrição
        const novaInscricao = await Inscricao.create({
            candidato_id: candidato.id,
            cargo_id,
            tempo_servico: parseInt(tempo_servico, 10) || 0,
        });

        console.log("Inscrição criada:", novaInscricao);

        // Criar formações
        if (Array.isArray(formacoes) && formacoes.length > 0) {
            const formacoesData = formacoes.map(f => ({
                tipo: f.tipo,
                instituicao: f.instituicao,
                curso: f.curso,
                periodo: f.periodo,
                carga_horaria: parseInt(f.carga_horaria, 10),
                inscricao_id: novaInscricao.id,
                candidato_id: candidato.id
            }));

            await Formacao.bulkCreate(formacoesData);
            console.log("Formações criadas:", formacoesData);
        }

        // Criar cursos de capacitação
        if (Array.isArray(cursos_capacitacao) && cursos_capacitacao.length > 0) {
            const cursosData = cursos_capacitacao.map(c => ({
                instituicao: c.instituicao,
                curso: c.curso,
                periodo: c.periodo,
                carga_horaria: parseInt(c.carga_horaria, 10),
                inscricao_id: novaInscricao.id,
                candidato_id: candidato.id
            }));

            await CursoCapacitacao.bulkCreate(cursosData);
            console.log("Cursos de capacitação criados:", cursosData);
        }

        res.status(201).json({ message: "Inscrição realizada com sucesso!" });
    } catch (error) {
        console.error("Erro ao criar inscrição:", error);
        res.status(500).json({ message: "Erro ao criar inscrição.", error: error.message });
    }
});

// Rota para listar todas as inscrições
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

// Rota para buscar inscrições por CPF
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
                { model: Formacao, attributes: ["tipo", "instituicao", "curso", "periodo", "carga_horaria"] },
                { model: CursoCapacitacao, attributes: ["instituicao", "curso", "periodo", "carga_horaria"] }
            ]
        });

        res.status(200).json(inscricoes);
    } catch (error) {
        console.error("Erro ao buscar inscrições:", error);
        res.status(500).json({ message: "Erro ao buscar as inscrições." });
    }
});
// Rota para excluir somente a inscrição
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // Buscar inscrição para verificar se ela existe
        const inscricao = await Inscricao.findByPk(id);

        if (!inscricao) {
            return res.status(404).json({ message: "Inscrição não encontrada!" });
        }

        // Excluir a inscrição
        await inscricao.destroy();

        res.status(200).json({ message: "Inscrição excluída com sucesso!" });
    } catch (error) {
        console.error("Erro ao excluir inscrição:", error);
        res.status(500).json({ message: "Erro ao excluir inscrição.", error: error.message });
    }
});

module.exports = router;