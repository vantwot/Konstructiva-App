const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
var flash = require('connect-flash');
var helpers = require('handlebars-helpers');
var math = helpers.math();


//Init
const app = express();
const sequelize = require('./database');
require('./models/passport');


//Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');


// Midd
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'secret',
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())


// Glob

//Routes
app.use(require('./routes/cliente'));
app.use(require('./routes/contable'));
app.use(require('./routes/ejecucion'));
app.use(require('./routes/personal'));
app.use(require('./routes/proyectos'));
app.use(require('./routes/login'));

// Node Modules
app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, '../node_modules/jquery/dist')))
app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap-datepicker/dist/css')))
app.use('/js', express.static(path.join(__dirname, '../node_modules/bootstrap-datepicker/dist/js')))
app.use('/umd', express.static(path.join(__dirname, '../node_modules/@popperjs/core/dist/umd')))

//static files 
app.use(express.static(path.join(__dirname, 'public')));

//Server
app.listen(app.get('port'), () => {
    console.log('Port : ', app.get('port'));

    // Conectar base de datos
    sequelize.sync({ force: false }).then(() => {
        console.log('Connection has been established successfully.');
    }).catch(error => {
        console.error('Unable to connect to the database:', error);
    })
});