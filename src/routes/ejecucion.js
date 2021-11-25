const router = require('express').Router();

router.get('/ejecucion', (req,res) =>{
    res.render("ejecucion/lista");
});

router.get('/ejecucion/materiales', (req,res) =>{
    res.send('parte de materiales');
});

router.get('/ejecucion/facturacion', (req,res) =>{
    res.send('parte de facturacion y compras');
});

router.get('/ejecucion/personal-temporal', (req,res) =>{
    res.send('parte de temporales');
});

module.exports = router;