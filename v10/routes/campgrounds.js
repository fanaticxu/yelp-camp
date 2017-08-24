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
router.post("/", isLoggedIn, function(req, res){
    //get data from form and add to campgrounds arry
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author};
    // newCampground.author.id = req.user._id;
    // newCampground.author.username = req.user.username;
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
router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// Show /campgrounds
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

//EDIT CAMPGROUND
router.get("/:id/edit", checkCampgroundOwnership, function(req, res){ 
        Campground.findById(req.params.id, function(err, campground){
                res.render("campgrounds/edit", {campground: campground});          
        });
    });


//UPDATE CAMPGROUND
router.put("/:id", checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

//DELETE
router.delete("/:id", checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});


//middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        console.log("Loggedin");
        return next();
    }
    console.log("NotLoggedin");
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next) {
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, campground){
               if(err) {
                console.log(err);
                res.redirect("back");
               } else {
                        if(campground.author.id.equals(req.user._id)){
                            next();
                        } 
                        else {
                            res.redirect("back");
                        }                           
                   }
                });
            }  
     else {
        res.redirect("back");;
    }
}

module.exports = router;