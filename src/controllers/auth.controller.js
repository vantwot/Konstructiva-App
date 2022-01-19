const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const session = require('express-session');

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
    res.redirect('/login');
};

exports.signin = (req, res) => {
    const user = User.findOne({
        where: {
            username: req.body.username
        }
    }) 
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            if (user.role == "admin") {
                res.render('users/admin', { user });
            }

            if (user.role == "ejecucion") {
                res.render('users/ejecucion', { user });
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