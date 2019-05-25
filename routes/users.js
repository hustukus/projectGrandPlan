var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
var Grandplan = require("../models/grandplan");
var User = require("../models/user");
// waiting still for the delete and update functionalitys of user to be implemented
var middleware = require("../middleware"); // when something is named index.js, it is automatically required (in this case) when the directory it's in is required

//Creation of Users is implemented in index.js, where the login and sign up logic are, to make a more clearer separation to User routes

//show register form / USER NEW route
router.get("/users/new", function(req, res) {
    res.render("users/new", {page: "register"});
});
//handle sign up logic / USER CREATE route
router.post("/users", function(req, res) {
    var newUser = new User({
        username: req.body.username, 
        email: req.body.email, 
        profilePic: req.body.profilePic, 
        userDescription: req.body.userDescription
    });
    if(req.body.adminCode === "iamyourfather"){
        newUser.isAdmin = true;
        console.log("created user is now admin");
    }
    console.log("created user is not admin");
    if(newUser.profilePic === ""){
        newUser.profilePic = "https://source.unsplash.com/2LowviVHZ-E";
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("users/new", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Grand Plans " + user.username);
            res.redirect("/grandplans");
        });
    });
});


// USER - SHOW route
router.get("/users/:id", function(req, res) {
    User.findById(req.params.id).populate("contributions").populate("createdGrandplans").populate("contributedGrandplans").exec(function(err, foundUser){
        if(err || !foundUser){
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect("/");
        }else{
            //render show template with that user
            res.render("users/show", {user: foundUser});
        }
    });
});





//under work, needs: new middleware, what actually can be changed?, both EDIT and UPDATE arts done
//USER EDIT route
// router.get("/users/:id/edit", middleware.checkCommentOwnership, function(req, res){
//     Grandplan.findById(req.params.id, function(err, foundGrandplan){
//         if(err || !foundGrandplan){
//             req.flash("error", "No grandplan found");
//             return res.redirect("/grandplans");
//         }
//         Comment.findById(req.params.comment_id, function(err, foundComment){
//             if(err){
//                 console.log(err);
//             }else{
//                 res.render("comments/edit", {grandplan_id: req.params.id, comment: foundComment});
//             }
//         });
//     });
// });

// //Comments UPDATE route
// router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
//     Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
//         if(err){
//             res.redirect("back");
//         }else{
//             res.redirect("/grandplans/" + req.params.id);
//         }
//     });
// });

module.exports = router;