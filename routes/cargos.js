const express = require("express");
const router = express.Router();
const { Sequelize } = require("sequelize");
const Cargo = require("../models/Cargo");

// Rota para buscar cargos pela zona
router.get("/", async (req, res) => {
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

module.exports = router;
