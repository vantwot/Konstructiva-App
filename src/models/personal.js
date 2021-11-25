const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database')

class Personal extends Model {}

Personal.init({
    nombre: { type: DataTypes.STRING, allowNull: false },
    valor: { type: DataTypes.INTEGER, allowNull: false },
}, {
    sequelize,
    modelName: "personal"
})

module.exports = Personal;