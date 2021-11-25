const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./user');
const helpers = require('./helpers');

passport.use('local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    user = await User.findOne({ where: { username: username } });
    if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
    }

    // verificar contraseña sin encriptar (sólo por ahora para la prueba)
    //const validPass = await helpers.matchPass(password, user.password);
    const validPass = password == user.password

    if (!validPass) {
        return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    user = await User.findByPk(id);
    done(null, user.dataValues);
});