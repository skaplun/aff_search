var aff_search = require('./../aff_search')
var follow_affs = require('./../follow_affs')

// app/routes.js
module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
     app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
    
     // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    
    
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    
    // =====================================
    // AFF SEARCH ==============================
    // =====================================
    app.get('/aff_search', function(req, res) {
        res.render('aff_search.ejs'); 
    
    });
    
    app.post('/aff_search', function(req, res){
        var r = req.body;
        if(!r.keyword || !r.tld || !r.brand || r.keyword.length === 0 || r.tld.length === 0|| r.brand.length === 0){
          res.json('please fill out all fields')  
        }else{
            aff_search(r.keyword, r.tld, r.brand).then(function(d){
                res.json(d) 
            })
        }

    });
    
    // =====================================
    // FOLLOW ROWS ==============================
    // =====================================
    
    app.get('/follow_affs',isLoggedIn, function(req, res) {
        follow_affs.getFollowed(req, res).then(function(data){
            res.render('follow_affs.ejs', {results : data})
        })
    
    });
    
     app.post('/follow_affs', function(req, res) {
        follow_affs.follow(req, res)
    
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}