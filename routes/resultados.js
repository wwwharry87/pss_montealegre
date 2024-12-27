const express = require("express");
const router = express.Router();
const { Inscricao, Formacao, CursoCapacitacao, Resultados, Candidato, Cargo } = require("../models");
const { Sequelize } = require("sequelize");

// Rota para gerar resultados
router.post("/gerar", async (req, res) => {
    try {
        console.log("Iniciando geração de resultados...");

        // Excluir resultados antigos
        await Resultados.destroy({ where: {} });

        const inscricoes = await Inscricao.findAll({
            include: [
                { association: Inscricao.associations.formacoes },
                { association: Inscricao.associations.cursosCapacitacao },
            ],
        });

        for (const inscricao of inscricoes) {
            let pontuacaoTotal = 0;

            // Calcular pontuação das formações
            const especializacoes = inscricao.formacoes.filter(f => f.tipo === "Especializacao");
            pontuacaoTotal += Math.min(especializacoes.length, 3) * 3.5;

            if (inscricao.formacoes.some(f => f.tipo === "Mestrado")) pontuacaoTotal += 4.5;
            if (inscricao.formacoes.some(f => f.tipo === "Doutorado")) pontuacaoTotal += 5.0;

            // Calcular tempo de serviço
            pontuacaoTotal += Math.min(inscricao.tempo_servico || 0, 10);

            // Calcular cursos de capacitação
            const cursosValidos = inscricao.cursosCapacitacao.filter(c => c.carga_horaria >= 40);
            pontuacaoTotal += Math.min(cursosValidos.length, 10);

            // Inserir ou atualizar na tabela resultados
            await Resultados.create({
                inscricao_id: inscricao.id,
                candidato_id: inscricao.candidato_id,
                pontuacao_total: pontuacaoTotal,
            });
        }

        console.log("Resultados gerados com sucesso.");
        res.status(200).json({ message: "Resultados gerados com sucesso." });
    } catch (error) {
        console.error("Erro ao gerar resultados:", error);
        res.status(500).json({ message: "Erro ao gerar resultados.", error: error.message });
    }
});

router.get('/listar', async (req, res) => {
    try {
        const resultados = await Resultados.findAll({
            include: [
                {
                    model: Inscricao,
                    as: 'inscricao',
                    include: [
                        { model: Cargo, as: 'cargo', attributes: ['nome', 'zona'] },
                        { model: Candidato, as: 'candidato', attributes: ['nome', 'cpf'] },
                    ],
                },
            ],
            order: [[Sequelize.col('pontuacao_total'), 'DESC']],
        });

        res.status(200).json(resultados);
    } catch (error) {
        console.error("Erro ao buscar resultados:", error.message);
        res.status(500).json({
            message: "Erro ao buscar os resultados.",
            error: error.message,
        });
    }
});


module.exports = router;
