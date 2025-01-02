class Resultados extends Model {}

Resultados.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        inscricao_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "inscricoes", // Certifique-se de que o nome da tabela está correto
                key: "id",
            },
        },
        candidato_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "candidatos", // Certifique-se de que o nome da tabela está correto
                key: "id",
            },
        },
        pontuacao_total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        idade: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0, // Valor padrão para entradas existentes
        },
    },
    {
        sequelize,
        modelName: "resultados",
        tableName: "resultados",
        freezeTableName: true,
    }
);

module.exports = Resultados;
