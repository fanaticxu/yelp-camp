var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment")

//comments new
router.get("/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }

    });

});

//create new comment
//connect new comment to campground
//redirect campground show page

//comments create /campgrounds/:id/comments
router.post("/", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err)
                {
                    console.log(err);
                }
                else {
                    //add a username and id to comment
                    //req.user came from passport
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//edit comments
router.get("/edit", isLoggedIn, function(req, res){
    Comment.findById(comment.author.id, function(err, comment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit");
        }
    });
});

//delete comments

// My solution
// router.post("/index/:id/comments", function(req, res){
//     Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
//         if(err) {
//             console.log(err);
//         } else {
//             console.log(req.params.id);
//             Comment.create(req.body.comment, function(err, comment){
//                 if(err) {
//                     console.log(err);
//                 } else {
//                         console.log(comment);
//                         campground.comments.push(comment);
//                         campground.save();
//                         console.log(campground);
//                         res.redirect("/index/" + req.params.id);
//                   }
//             });
//         }
//     });
// });

//middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        console.log("Loggedin");
        return next();
    }
    console.log("NotLoggedin");
    res.redirect("/login");
}

module.exports = router;
