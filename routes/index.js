const express = require('express');
const router = express.Router({mergeParams: true});
const passport = require('passport');
const User = require('../models/user');

router.get('/', (req,res) => {
    res.render('loader', {
        pageTitle: '',
        path: '/'
    });
});

router.get('/index', (req,res) => {
    res.render('index', {
        pageTitle: 'Index Page',
        path: '/index'
    })
})

// show register form
router.get('/register', (req,res)=>{
    console.log('working - get - /register');
    res.render('register', {
        pageTitle:'Register Page',
        path: '/register'
    });
});

// handle signup logic
router.post('/register',(req,res)=>{
    console.log(req.body.username);
    User.register(new User({username: req.body.username, fullname: req.body.fullname, email: req.body.email}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            // req.flash("error",err.message);
            return res.render('register', {
                pageTitle:'Register Page',
                path: '/register'
            });
        }
        passport.authenticate('local')(req,res,function(){
            // req.flash("success",`Welcome to Cinemix ${user.username}`);
            res.redirect('/home');
        });
    });
});

// show login form
router.get('/login', (req,res)=>{
    res.render('login', {
        pageTitle:'Login Page',
        path: '/login'
    });
});

// handle login logic
router.post('/login', passport.authenticate("local",{
    successRedirect: "/home",
    failureRedirect: "/login"
}), function(req,res){

});

// logout login
router.get('/logout',(req,res)=>{
    req.logout();
    // req.flash("success", "Logged you out!");
    res.redirect('/index');
});

module.exports = router;