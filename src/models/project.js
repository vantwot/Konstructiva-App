const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database')

const Cliente = require('./cliente')
const Anticipo = require('./anticipos')
const Requerimiento = require('./requerimiento')
const Contrato = require('./contrato')
const Material = require('./material')
const Personal = require('./personal')
const Factura = require('./factura')

class Proyecto extends Model {}

Proyecto.init({
    namep: { type: DataTypes.STRING, allowNull: false },
    fecha_inicio: { type: DataTypes.STRING, allowNull: false },
    fecha_fin: { type: DataTypes.STRING, allowNull: false },
    presupuesto: { type: DataTypes.INTEGER, defaultValue: 0 },
    anticipo: { type: DataTypes.INTEGER, defaultValue: 0 },
    date: { type: DataTypes.DATE, defaultValue: Date.now },
}, {
    sequelize,
    modelName: "proyecto"
})

Proyecto.hasOne(Cliente)
Cliente.belongsTo(Proyecto)

Proyecto.hasMany(Anticipo)
Anticipo.belongsTo(Proyecto)

Proyecto.hasMany(Requerimiento, {foreignKey:'proyectoId'})
Requerimiento.belongsTo(Proyecto, {foreignKey:'proyectoId'})

Proyecto.hasMany(Contrato, {foreignKey:'proyectoId'})
Contrato.belongsTo(Proyecto, {foreignKey:'proyectoId'})

Proyecto.hasMany(Personal)
Personal.belongsTo(Proyecto)

Proyecto.hasMany(Factura)
Factura.belongsTo(Proyecto)

module.exports = Proyecto;