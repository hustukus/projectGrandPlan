var express = require("express");
var router = express.Router({mergeParams: true});
var Grandplan = require("../models/grandplan");
var Comment = require("../models/comment");
var middleware = require("../middleware"); // when something is named index.js, it is automatically required (in this case) when the directory it's in is required


// ======================================
// COMMENTS ROUTES
// ======================================

//Comments NEW route
router.get("/new", middleware.isLoggedIn, function(req, res) {
    // find grandplan by id
    Grandplan.findById(req.params.id, function(err, grandplan){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {grandplan: grandplan});
        }
    });
    
});

//Comments CREATE route
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup grandplan using ID
    Grandplan.findById(req.params.id, function(err, grandplan) {
        if(err){
            console.log(err);
        }else{
            console.log(req.body.comment);
            Comment.create(req.body.comment, function(err, comment){
                console.log(comment);
                if(err){
                    req.flash("error", "Something went wrong with the database (most likely)");
                    console.log(err);
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    grandplan.comments.push(comment);
                    grandplan.save();
                    console.log(comment);
                    console.log(grandplan.comments);
                    req.flash("success", "Successfully created a comment!");
                    res.redirect("/grandplans/" + grandplan._id);
                }
            });
        }
    });
});

//Comments EDIT route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Grandplan.findById(req.params.id, function(err, foundGrandplan){
        if(err || !foundGrandplan){
            req.flash("error", "No grandplan found");
            return res.redirect("/grandplans");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                console.log(err);
            }else{
                res.render("comments/edit", {grandplan_id: req.params.id, comment: foundComment});
            }
        });
    });
});

//Comments UPDATE route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/grandplans/" + req.params.id);
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
            res.redirect("/grandplans/" + req.params.id);
        }
    });
});

module.exports = router;