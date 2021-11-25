const router = require('express').Router();

router.get('/personal/contratos', (req,res) =>{
    res.send('lista contratos');
});

router.get('/personal/editar-contratos', (req,res) =>{
    res.send('editar contratos');
});

router.get('/personal/nuevo-contrato', (req,res) =>{
    res.send('crear contrato');
});

router.get('/personal/lista-trabajadores', (req,res) =>{
    res.send('lista trabajadores');
});

router.get('/personal/nuevo-trabajadores', (req,res) =>{
    res.send('crear un nuevo trabajador');
});

router.get('/personal/editar-trabajadores', (req,res) =>{
    res.send('modificar trabajadores');
});
module.exports = router;