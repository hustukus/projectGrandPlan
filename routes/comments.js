var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware"); // when something is named index.js, it is automatically required (in this case) when the directory it's in is required


// ======================================
// COMMENTS ROUTES
// ======================================

//Comments NEW route
router.get("/new", middleware.isLoggedIn, function(req, res) {
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
    
});

//Comments CREATE route
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup campground usinf ID
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong with the database (most likely)");
                    console.log(err);
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    //console.log(comment);
                    req.flash("success", "Successfully created a comment!");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//Comments EDIT route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
        }else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

//Comments UPDATE route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Comments DESTROY route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Successfully deleted comment!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;