var express = require("express");
var router = express.Router({mergeParams: true});
var Grandplan = require("../models/grandplan");
var Contribution = require("../models/contribution");
var middleware = require("../middleware"); // when something is named index.js, it is automatically required (in this case) when the directory it's in is required


//CONTRIBUTION NEW route
router.get("/new", middleware.isLoggedIn, function(req, res) {
    // find grandplan by id
    Grandplan.findById(req.params.id, function(err, grandplan){
        if(err){
            console.log(err);
        }else{
            res.render("contribution/new", {grandplan: grandplan});
        }
    });
    
});


//CONTRIBUTION CREATE route
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup grandplan usinf ID
    Grandplan.findById(req.params.id, function(err, grandplan) {
        if(err){
            console.log(err);
        }
        console.log(grandplan);
        Contribution.create(req.body.contribution, function(err, newContribution){
            console.log(newContribution);
            if(err){
                req.flash("error", "Something went wrong with the database (most likely)");
                console.log(err);
            }else{
                console.log("we made to part 2");
                //add username and id to contribution
                newContribution.author.id = req.user._id;
                newContribution.author.username = req.user.username;
                //save contribution
                newContribution.save();
                grandplan.contributions.push(newContribution);
                console.log("this is grandplan: " + grandplan);
                grandplan.save();
                //save contribution to spesific user
                console.log("before pushing the contribution" + req.user.contributions);
                req.user.contributions.push(newContribution);
                console.log("after pushing the contribution" + req.user.contributions);
                //save grandplan that has been contributed to
                console.log("before pushing the grandplan " + req.user.contributedGrandplans);
                req.user.contributedGrandplans.push(grandplan);
                console.log("after pushing the grandplan " + req.user.contributedGrandplans);
                //save the updated user data 
                req.user.save();
                req.flash("success", "Successfully created a contribution!");
                res.redirect("/grandplans/" + grandplan._id);
            }
        });
    });
});


//CONTRIBUTION EDIT route
router.get("/:contribution_id/edit", middleware.checkContributionOwnership, function(req, res){
    Grandplan.findById(req.params.id, function(err, foundGrandplan){
        if(err || !foundGrandplan){
            req.flash("error", "No Grandplan found");
            return res.redirect("/grandplans");
        }
        Contribution.findById(req.params.contribution_id, function(err, foundContribution){
            if(err){
                console.log(err);
            }else{
                res.render("contribution/edit", {grandplan_id: req.params.id, contribution: foundContribution});
            }
        });
    });
});

//CONTRIBUTION UPDATE route
router.put("/:contribution_id", middleware.checkContributionOwnership, function(req, res){
    Contribution.findByIdAndUpdate(req.params.contribution_id, req.body.contribution, function(err, updatedContribution){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/grandplans/" + req.params.id);
        }
    });
});

//Comments DESTROY route
router.delete("/:contribution_id", middleware.checkContributionOwnership, function(req, res){
    Contribution.findByIdAndRemove(req.params.contribution_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Successfully deleted contribution!");
            res.redirect("/grandplans/" + req.params.id);
        }
    });
});






module.exports = router;