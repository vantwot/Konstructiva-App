const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database')

class Personal extends Model {}

Personal.init({
    numero: { type: DataTypes.INTEGER, allowNull: false },
    nombre: { type: DataTypes.STRING, allowNull: false },
    cedula: { type: DataTypes.INTEGER, allowNull: false },
    profesion: { type: DataTypes.STRING, allowNull: false },
    valor: { type: DataTypes.INTEGER, allowNull: false },
    
}, {
    sequelize,
    modelName: "personal"
})

module.exports = Personal;