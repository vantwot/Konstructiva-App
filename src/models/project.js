const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database')

const Cliente = require('./cliente')
const Anticipo = require('./anticipos')
const Requerimiento = require('./requerimiento')
const Contrato = require('./contrato')
const Material = require('./material')
const Personal = require('./personal')

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

Proyecto.hasMany(Requerimiento)
Requerimiento.belongsTo(Proyecto)

Proyecto.hasMany(Contrato)
Contrato.belongsTo(Proyecto)

Proyecto.hasMany(Material)
Material.belongsTo(Proyecto)

Proyecto.hasMany(Personal)
Personal.belongsTo(Proyecto)

module.exports = Proyecto;