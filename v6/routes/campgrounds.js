var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

//INDEX -SHOW ALL CAMPGROUNDS
router.get("/", function(req, res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
    // res.render("campgrounds", {campgrounds: campgrounds});
});

//CREATE - ADD new campground to DB
router.post("/", function(req, res){
    //get data from form and add to campgrounds arry
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image}
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
    //Create a new campground and save to DB
    // campgrounds.push(newCampground);
    //redirect back to campground page

});

// NEW - show form to create new campground
router.get("/new", function(req, res){
    res.render("campgrounds/new");
});

// Show
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
        if(err)
        {
            console.log(err);
        }
        else{
            res.render("campgrounds/show", {campground: campground});
        }
    });
});

module.exports = router;