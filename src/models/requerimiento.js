const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database')

class Requerimiento extends Model {}

Requerimiento.init({
    nombre: { type: DataTypes.STRING, allowNull: false },
    valor: { type: DataTypes.INTEGER, allowNull: false },
}, {
    sequelize,
    modelName: "requerimiento"
})

module.exports = Requerimiento;