const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database')

class Anticipo extends Model {}

Anticipo.init({
    namean: { type: DataTypes.STRING, allowNull: false },
    valor: { type: DataTypes.INTEGER, allowNull: false },
}, {
    sequelize,
    modelName: "anticipo"
})

module.exports = Anticipo;