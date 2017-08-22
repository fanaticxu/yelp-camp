var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
        {
            name: "Bluff View Clearwater Lake Campground", 
            image: "https://www.campsitephotos.com/photo/camp/25066/Bluff_View_A_001.jpg",
            description: "Ecce dabo Pinkman Isai OK? Sicut locutus est tibi, et datus est, et hic sine Semper consequat volumus ... et ille in urbe ista licet? Et infernus, ubi tu non Virginiae ornare vel ipsum. Ut enim Albuquerque et ille eum iure hic, et ego ducam te ad iustitiam. Quid dicis? "
        },
        {
            name: "Myrtle Beach State Park Campground ", 
            image: "https://www.campsitephotos.com/photo/camp/32757/Myrtle_Beach_001.jpg", 
            description: "Ecce dabo Pinkman Isai OK? Sicut locutus est tibi, et datus est, et hic sine Semper consequat volumus ... et ille in urbe ista licet? Et infernus, ubi tu non Virginiae ornare vel ipsum. Ut enim Albuquerque et ille eum iure hic, et ego ducam te ad iustitiam. Quid dicis? "
        },
        {
            name: "Plaskett Creek State Park Campground", 
            image: "https://www.campsitephotos.com/photo/camp/19882/Plaskett_Creek__Group_3.jpg", 
            description: "Ecce dabo Pinkman Isai OK? Sicut locutus est tibi, et datus est, et hic sine Semper consequat volumus ... et ille in urbe ista licet? Et infernus, ubi tu non Virginiae ornare vel ipsum. Ut enim Albuquerque et ille eum iure hic, et ego ducam te ad iustitiam. Quid dicis? "
        }
    ];
    
function seedDB() {
    //Remove all campgrounds
    Campground.remove({}, function(err){
        if(err)
        {
            console.log(err);
        }
        else {
            console.log("removed campgrounds!");
                // add a few campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("added a campground");
                        // create a comment
                        Comment.create(
                            {
                                text: "This palce is greate",
                                author: "Homer"
                            }, function(err, comment){
                            if(err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment")
                            }

                        });
                    }
                });
            });
        }
    });  
    

}

module.exports = seedDB;