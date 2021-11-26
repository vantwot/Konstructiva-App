const router = require('express').Router();
const Proyecto = require('../models/project');


// PARTE DE CONTRATOS

router.get('/ejecucion/contratost', (req,res) =>{
    res.render('ejecucion/lista-contratos');
});

router.get('/ejecucion/crear-contratost', (req,res) =>{
    res.render('ejecucion/crear-contratos');
});

router.post('/ejecucion/nuevo-contratost', async (req,res) =>{
    
});

module.exports = router;