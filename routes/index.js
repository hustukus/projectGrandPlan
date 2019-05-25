var express = require("express");
var router = express.Router();
var passport = require("passport");

// Root Route
router.get("/", function(req, res){
   res.render("landing");
});

//show login form
router.get("/login", function(req, res) {
    res.render("login", {page: "login"});
});
//handle login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/grandplans", 
        failureRedirect: "/login"
    }),function(req, res) {
    
});

//logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out successfully!");
    res.redirect("/grandplans");
});

module.exports = router;