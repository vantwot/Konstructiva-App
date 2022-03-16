const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database')
const Material = require('./material')

class Factura extends Model {}

Factura.init({
    numero: { type: DataTypes.INTEGER, allowNull: false },
    nombre: { type: DataTypes.STRING, allowNull: false },
    direccion: { type: DataTypes.STRING, allowNull: false },
    ciudad: { type: DataTypes.STRING, defaultValue: 0 },
    telefono: { type: DataTypes.INTEGER, defaultValue: 0 },
    valorTotal: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
    sequelize,
    modelName: "facturas"
})

Factura.hasMany(Material, {foreignKey:'facturaId'})
Material.belongsTo(Factura, {foreignKey:'facturaId'})

module.exports = Factura;