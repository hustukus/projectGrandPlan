var express = require("express");
var router = express.Router();
var Grandplan = require("../models/grandplan");
var middleware = require("../middleware"); // when something is named index.js, it is automatically required (in this case) when the directory it's in is required

// // INDEX - show all grandplans
// router.get("/", function(req, res){
//     //Get all grandplans from DB
//     GrandPlan.find({}, function(err, allGrandplans){
//         if(err){
//             console.log(err);
//         }else{
//             res.render("grandplans/index", {grandplans: allGrandplans});
//         }
//     });
// });

//INDEX - show all Grandplans
router.get("/", function(req, res){
    // needed for pagination feature
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    // needed for search feature
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Grandplan.find({name: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allGrandplans) {
            Grandplan.countDocuments({name: regex}).exec(function (err, count) {
                if (err) {
                    console.log(err);
                    res.redirect("back");
                } else {
                    if(allGrandplans.length < 1) {
                        noMatch = "No Grandplans match that query, please try again.";
                    }
                    res.render("grandplans/index", {
                        grandplans: allGrandplans,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        noMatch: noMatch,
                        search: req.query.search
                    });
                }
            });
        });
    } else {
        // get all Grandplans from DB
        Grandplan.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allGrandplans) {
            Grandplan.countDocuments().exec(function (err, count) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("grandplans/index", {
                        grandplans: allGrandplans,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        noMatch: noMatch,
                        search: false
                    });
                }
            });
        });
    }
});

//CREATE - create a new grandplan to database
router.post("/", middleware.isLoggedIn, function(req, res){
   // get data from the form and add to grandplans array
   var name = req.body.name ;
   var reqContr = req.body.reqContr;
   var actContr = req.body.actContr;
   var image = req.body.image;
   var desc = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
   };
   var newGrandplan = {name: name, reqContr: reqContr, actContr: actContr, image: image, description: desc, author: author};
   // create new grandplan and save it to DB
   Grandplan.create(newGrandplan, function(err, newlyCreated){
       if(err){
           console.log(err);
       }else{
            //save the link from new Grandplan to user
            console.log("before pushing " + req.user);
            req.user.createdGrandplans.push(newlyCreated);
            console.log("after pushing " + req.user);
            console.log("after pushing " + req.user.createdGrandplans);
            req.user.save();
            // redirect back to grandplans page
            console.log(newlyCreated);
            res.redirect("grandplans");
       }
   });
});

//NEW - show form to create new grandplan
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("grandplans/new");
});

// SHOW - shows more info about a single Grandplan 
router.get("/:id", function(req, res){
    //find the grandplan with provided ID
    Grandplan.findById(req.params.id).populate("comments").populate("contributions").exec(function(err, foundGrandplan){
        if(err || !foundGrandplan){
            console.log(err);
            req.flash("error", "Grandplan not found");
            res.redirect("/grandplans");
        }else{
            //render show template with that Grandplan
            res.render("grandplans/show", {grandplan: foundGrandplan});
        }
    });
});

//EDIT - edit the selected grandplan
router.get("/:id/edit", middleware.checkGrandplanOwnership, function(req, res) {
        Grandplan.findById(req.params.id, function(err, foundGrandplan){
            res.render("grandplans/edit", {grandplan: foundGrandplan});
        });
});

//UPDATE - update the selected grandplan
router.put("/:id", middleware.checkGrandplanOwnership ,function(req, res){
   //find and update the correct grandplan
   Grandplan.findByIdAndUpdate(req.params.id, req.body.grandplan, function(err, updatedGrandplan){
       if(err){
           console.log(err);
           res.redirect("/grandplans");
       }else{
           res.redirect("/grandplans/" + req.params.id);
       }
   });
});

//DESTROY - delete the selected grandplan
router.delete("/:id", middleware.checkGrandplanOwnership ,function(req, res){
    Grandplan.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/grandplans");
        }else{
            res.redirect("/grandplans");
        }
    });
});

// used with the search functionality to make it more secure
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;