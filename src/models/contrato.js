const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database')

class Contrato extends Model {}

Contrato.init({
    nombre: { type: DataTypes.STRING, allowNull: false },
    tarea: { type: DataTypes.STRING, allowNull: false },
    valor: { type: DataTypes.INTEGER, allowNull: false },
}, {
    sequelize,
    modelName: "contrato"
})

module.exports = Contrato;