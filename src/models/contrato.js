const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database')

class Contrato extends Model {}

Contrato.init({
    numero: { type: DataTypes.INTEGER, allowNull: false },
    nombre: { type: DataTypes.STRING, allowNull: false },
    cedula: { type: DataTypes.INTEGER, allowNull: false },
    fecha_inicio: { type: DataTypes.STRING, allowNull: false },
    fecha_fin: { type: DataTypes.STRING, allowNull: false },
    valor: { type: DataTypes.INTEGER, allowNull: false },
}, {
    sequelize,
    modelName: "contratos"
})

module.exports = Contrato;