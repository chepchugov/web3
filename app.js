const passport = require('passport');
const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
const mongoose = require('mongoose');

const {User} = require('./database');
const handlebarsHelpers = require('./utils/handlebars-helpers');
const config = require('./config');
const locals = require('./utils/locals');
const indexRouter = require('./routes/index');
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const tasksRouter = require('./routes/tasks');
const notFoundRouter = require('./routes/not-found');

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const app = express();

app.engine('hbs', expressHandlebars.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: handlebarsHelpers
}).engine);
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(expressSession({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        autoRemove: 'interval',
        autoRemoveInterval: 60
    }),
    cookie: {maxAge: 24 * 60 * 60 * 1000}
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(locals());
app.use(indexRouter);
app.use(signupRouter);
app.use(loginRouter);
app.use(logoutRouter);
app.use(tasksRouter);
app.use(notFoundRouter);

app.use(function (req, res) {
    res.redirect('/not-found');
});

app.use(function (err, req, res) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
