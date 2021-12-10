const router = require('express').Router();
const Proyecto = require('../models/project');
const Contrato = require('../models/contrato')

// PARTE DE CONTRATOS

router.get('/ejecucion/contratost', async (req,res) =>{
    const contratos = await Contrato.findAll();
    res.render("ejecucion/lista-contratos", { contratos });
});

router.get('/ejecucion/crear-contratost', (req,res) =>{
    res.render('ejecucion/crear-contratos');
});

router.post('/ejecucion/nuevo-contratost', async (req, res) => {
    const { numero, nombre, cedula, fecha_inicio, fecha_fin, valor } = req.body;
    const errors = [];
    if (!numero) {
        errors.push({ text: 'Por favor inserte un numero de contrato' });
    }
    if (!nombre) {
        errors.push({ text: 'Por favor inserte un nombre' });
    }
    if (!cedula) {
        errors.push({ text: 'Por favor inserte una cedula' });
    }
    if (!fecha_inicio) {
        errors.push({ text: 'Por favor inserte una fecha de inicio' });
    }
    if (!fecha_fin) {
        errors.push({ text: 'Por favor inserte una fecha de fin' });
    }
    if (!valor) {
        errors.push({ text: 'Por favor inserte un valor' });
    }
    if (errors.length > 0) {
        res.render('ejecucion/crear-contratos', {
            errors,
            numero,
            nombre,
            cedula,
            fecha_inicio,
            fecha_fin,
            valor
        });
    } else {
    const newContrato = Contrato.build({ numero: numero, nombre: nombre, cedula: cedula, fecha_inicio: fecha_inicio, fecha_fin: fecha_fin, valor: valor });
    await newContrato.save();

        res.redirect('/ejecucion/contratost');
    }
    
});

module.exports = router;