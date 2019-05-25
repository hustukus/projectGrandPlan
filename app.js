var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
// var seedDB = require("./seeds"); Used to populate some dummy data to the database, not in use currently
var passport  = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");
var flash = require("connect-flash");
var moment = require("moment");
moment().format();

// requiring routes
var commentRoutes = require("./routes/comments"),
    grandplanRoutes = require("./routes/grandplans"),
    indexRoutes = require("./routes/index"),
    userRoutes = require("./routes/users"),
    contributionRoutes = require("./routes/contribution");

mongoose.connect('mongodb://localhost:27017/grand_plans', { useNewUrlParser: true });

//connecting to the db through mongo db atlas
// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://dbJustus:datavarasto123@cluster0-aaclu.mongodb.net/test?retryWrites=true";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//     if(err){
//         console.log(err);
//     }else{
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
//     }
// });


app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");
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
app.use("/grandplans", grandplanRoutes);
app.use("/grandplans/:id/comments", commentRoutes);
app.use(userRoutes);
app.use("/grandplans/:id/contribution", contributionRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("grandplans starting!") ;
});