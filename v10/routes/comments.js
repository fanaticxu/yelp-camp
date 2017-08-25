var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//comments new
router.get("/new", middleware.isLoggedIn, function(req, res){
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
router.post("/", middleware.isLoggedIn, function(req, res){
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
router.get("/:comment_id/edit", middleware.checkCommentsOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
   });

//update comments
router.put("/:comment_id", middleware.checkCommentsOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//delete comments
router.delete("/:comment_id", middleware.checkCommentsOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


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


module.exports = router;
