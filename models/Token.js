const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ajuste o caminho conforme sua configuração de banco

class Token extends Model {}

Token.init(
    {
        candidatoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Token',
        tableName: 'tokens',
        timestamps: false,
    }
);

module.exports = Token;
