var express               = require("express");

// Database
var mongoose              = require("mongoose");
var passport              = require("passport");
var bodyParser            = require("body-parser");
var localStrategy         = require("passport-local");
// var passportLocalMongoose = require("passport-local-mongoose");
mongoose.connect("mongodb://localhost/auth_demo_app");
var User                  = require("./models/user");

// app.use(express.static("public"));
// app.use(express.static(__dirname + "/public"));

var app = express();
app.set("view engine", "ejs");
// to  tell express to use passport & express session , sectret resave uninitialized all reqd
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
// app.use(function(req,res,next){
//     res.locals.error = req.flash("error"); // for message flashing red alerts called error
//     res.locals.success = req.flash("success"); // success alerts with green bootstrap called  success
//     next();
// });
app.use(require("express-session")({
    secret:"Rusty is the best dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//for local strategy use this
passport.use(new localStrategy(User.authenticate()));
// Below two are already initialized in passport local automaticallyso just ask to use
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




//==========
//Routes
//==========

app.get("/",function(req,res){
    res.render("login.ejs");
    req.flash("success","Please LOGIN to continue");
});

//Auth routes

//show sign up form
app.get("/register",function(req,res){
    res.render("register.ejs");
    req.flash("success","Welcome New User");
});

//handling user sign up
app.post("/register",function(req,res){
    req.body.username;
    req.body.password;
    User.register(new User({username: req.body.username}), req.body.password,function(err,user){
       if(err)
       {
           console.log("ERROR");
           req.flash("error","Please try again.");
           res.render("register");
           
       }
       else{
           passport.authenticate("local")(req, res, function(){
               res.redirect("/home");
               req.flash("success","Registered successfully");
           });
       }
    });
    // res.send("User Sign Up");
});

app.get("/home",isLoggedIn,function(req,res){
    res.render("home.ejs");
} );
  
  
  
// login
// RENDER LOGIN FORM
app.get("/login",function(req,res){
    res.render("login.ejs");
});

// Login post logic
app.post("/login",passport.authenticate("local",{
    successRedirect: "/home",
    failureRedirect: "/login"
}),function(req,res){
    //empty for now
    
});

//logout

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
   req.flash("success","Logged out successfully");
});

// to check for login and use as middleware in app.get secret page
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
   
    res.redirect("/login");
    req.flash("error", "Please LogIn to continue!");
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Running");
});