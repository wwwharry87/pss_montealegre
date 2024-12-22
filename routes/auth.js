const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Candidato = require("../models/Candidato");

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

        // Respond with success
        res.status(200).json({ message: "Login realizado com sucesso!" });
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        res.status(500).json({ message: "Erro ao realizar login." });
    }
});


module.exports = router;
