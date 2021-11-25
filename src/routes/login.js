const router = require('express').Router();
const passport = require('passport');

router.get('/login', (req,res) =>{
    res.render('inicio/login');
});

router.post('/login', 
    passport.authenticate('local', {
        successRedirect: '/proyecto/lista',
        failureRedirect: '/login',
        failureFlash: true
    })
);

router.get('/proyecto/add', (req,res) =>{
    res.render('proyecto/crear');
});

router.get('/panel-inicio', (req,res) =>{
    res.send('inicio de panel');
});

module.exports = router;