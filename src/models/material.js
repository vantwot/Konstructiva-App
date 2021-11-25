const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database')

class Material extends Model {}

Material.init({
    nombre: { type: DataTypes.STRING, allowNull: false },
    valor: { type: DataTypes.INTEGER, allowNull: false },
}, {
    sequelize,
    modelName: "material"
})

module.exports = Material;
