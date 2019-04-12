var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
// var Campground = require("./models/campground");
var seedDB = require("./seeds");
// var Comment = require("./models/comment");
var passport  = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");
var flash = require("connect-flash");

// requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

//mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });
mongoose.connect("mongodb+srv://dbJustus:<datavaraSTO>@cluster0-aaclu.mongodb.net/yelp_camp?retryWrites=true"); // the yelp_camp part should be replaced
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seed the database
// seedDB();

// PASSPORT CONFIG (authentication)
app.use(require("express-session")({
    secret: "The chamber of secrets has opend again!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// will be called on every route (to allow user information to be present at every route)
// req.user will be empty if no one is signed in, and contains information when someone is signed in
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// requires routes to views
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("yelpcamp starting!") ;
});