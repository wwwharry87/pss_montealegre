const bcrypt = require("bcrypt");
const Candidato = require("./models/Candidato");

(async () => {
    try {
        const candidatos = await Candidato.findAll();
        for (const candidato of candidatos) {
            if (candidato.senha && !candidato.senha.startsWith("$2b$")) {
                const hashedPassword = await bcrypt.hash(candidato.senha, 10);
                candidato.senha = hashedPassword;
                await candidato.save();
                console.log(`Senha criptografada para o candidato com CPF: ${candidato.cpf}`);
            }
        }
        console.log("Todas as senhas foram criptografadas com sucesso.");
    } catch (error) {
        console.error("Erro ao criptografar as senhas:", error);
    }
})();
