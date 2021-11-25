const router = require('express').Router();

router.get('/contable/proyecto', (req,res) =>{
    res.send('parte contable de cada proyecto');
});

router.get('/contable/lista', (req,res) =>{
    res.send('lista de proyectos parte contable');
});

module.exports = router;