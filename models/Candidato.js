const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/database");

class Candidato extends Model {}

Candidato.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cpf: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        rg: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        dataNascimento: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        sexo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        telefone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        celular: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cep: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        logradouro: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        bairro: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        numero: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        complemento: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        municipio: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false, // Definido como obrigatório
        },
        pcd: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'nao', // Valor padrão
        },
        cid: {
            type: DataTypes.STRING,
            allowNull: true, // Pode ser nulo se PcD for 'nao'
        },        
    },
    {
        sequelize,
        modelName: "candidato",
        tableName: "candidatos",
        freezeTableName: true, // Evita pluralização automática
    },
        {
        hooks: {
            beforeCreate: async (candidato) => {
                if (candidato.senha) {
                    const salt = await bcrypt.genSalt(10);
                    candidato.senha = await bcrypt.hash(candidato.senha, salt);
                }
            },
            beforeUpdate: async (candidato) => {
                if (candidato.senha) {
                    const salt = await bcrypt.genSalt(10);
                    candidato.senha = await bcrypt.hash(candidato.senha, salt);
                }
            },
        },
});

module.exports = Candidato;
