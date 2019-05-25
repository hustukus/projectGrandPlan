var Grandplan = require("../models/grandplan");
var Comment = require("../models/comment");
var Contribution = require("../models/contribution");
//all middlewares go here
var middlewareObj = {};

middlewareObj.checkGrandplanOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        Grandplan.findById(req.params.id, function(err, foundGrandplan){
            if(err || !foundGrandplan){
                req.flash("error", "Grandplan not found");
                res.redirect("/grandplans");
            }else{
                //does user own the grandplan or is admin
                if(foundGrandplan.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }else{
                    req.flash("error", "You don't have premission to do that :(");
                    res.redirect("/grandplans");
                }
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                console.log(err);
                req.flash("error", "Comment not found");
                res.redirect("/grandplans");
            }else{
                //does user own the comment
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }else{
                    req.flash("error", "You don't have the permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkContributionOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        Contribution.findById(req.params.contribution_id, function(err, foundContribution){
            if(err || !foundContribution){
                console.log(err);
                req.flash("error", "Contribution not found");
                res.redirect("/grandplans");
            }else{
                //does user own the contribution
                if(foundContribution.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }else{
                    req.flash("error", "You don't have the permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to Sign Up or Log in to do that");
    res.redirect("/users/new");
};


module.exports = middlewareObj;