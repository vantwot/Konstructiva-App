const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database')

class Cliente extends Model {}

Cliente.init({
    nombre: { type: DataTypes.STRING, allowNull: false },
    cedula: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
    sequelize,
    modelName: "cliente"
})

module.exports = Cliente;