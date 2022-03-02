

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database')

class Factura extends Model {}

Factura.init({
    link: { type: DataTypes.STRING, allowNull: false }
}, {
    sequelize,
    modelName: "facturas"
})

module.exports = Factura;