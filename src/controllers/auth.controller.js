const db = require("../models");
const User = db.user;
const Role = db.role;
const session = require('express-session');
const config = require("../config/auth.config");


const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


exports.signup = (req, res) => {
    // Save User to Database
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        role: req.body.role,
    })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
    res.redirect('/signup');
};

exports.signin = (req, res) => {
    const user = User.findOne({
        where: {
            username: req.body.username
        }
    }) 
        .then(user => {
            if (!user) { 
                const errors = [];
                errors.push({ text: 'Usuario no encontrado' });
                return res.render("users/login", {errors});       
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                const errors = [];
                errors.push({ text: 'Contraseña incorrecta' });
                return res.render("users/login", {errors});          
            }

            if (user.role == "administrador") { //Si es admin mostrar cinco modulos
                res.render('users/admin', { user });
            }

            if (user.role == "compras") { // Si es compras mostrar modulo ejecucion
                res.render('users/ejecucion', { user });
            }

            if (user.role == "contador") { // Si es contador mostrar modulo reportes
                res.render('users/contador', { user });
            }

            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            ;
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};