const router = require('express').Router();
const Proyecto = require('../models/project');
const Anticipo = require('../models/anticipos');
const Cliente = require('../models/cliente');
const Requerimiento = require('../models/requerimiento')
const Contrato = require('../models/contrato')

router.get('/reportes/info-proyectos', async(req, res) => {
    const proyectos = await Proyecto.findAll({ order: [ [ 'date', 'DESC' ] ], include: [ Cliente, Contrato ]});
    res.render("reportes/reportesProyecto", {proyectos});
});

router.get('/reportes/info-contratost', async (req,res) =>{
    const contratos = await Contrato.findAll({ include: Proyecto });
    res.render("reportes/reporteContratosT.hbs", { contratos});
});

router.get('/reportes/info-grafica1', async (req,res) =>{
    const contratos = await Contrato.findAll();
    res.render("reportes/reporteGrafico1.hbs", { contratos });
});
module.exports = router;