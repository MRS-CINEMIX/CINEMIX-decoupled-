const path = require('path');
const express = require('express');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const User = require('./models/user');
const indexRoutes = require('./routes/index');
const movieRoutes = require('./routes/movies');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

// App Config
dotenv.config();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride('_method'));
connectDB();

// Passport Config
app.use(require('express-session')({
    secret: "Hail Hitler",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

// Routes
app.use('/',indexRoutes);
app.use('/',movieRoutes);

app.listen(process.env.PORT, () => {
    console.log(chalk.bgGreen(`server running on port ${process.env.PORT}...`));
});