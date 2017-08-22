var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

mongoose.Promise = global.Promise;
   
mongoose.connect("mongodb://localhost/yelpcamp", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
console.log(__dirname);
seedDB(); 

//Passport configuration
app.use(require("express-session")({
    secret: "Sean is the best",
    resave: false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

app.get("/", function(req, res){
    res.render("landing");
});

//INDEX -SHOW ALL CAMPGROUNDS
app.get("/index", function(req, res){
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
app.post("/index", function(req, res){
    //get data from form and add to campgrounds arry
    var name = req.body.name; 
    var image = req.body.image;
    var newCampground = {name: name, image: image}
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("index");   
        }
    });
    //Create a new campground and save to DB
    // campgrounds.push(newCampground);
    //redirect back to campground page

});

// NEW - show form to create new campground
app.get("/index/new", function(req, res){
    res.render("campgrounds/new");
});

// Show
app.get("/index/:id", function(req, res){
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

// =================
// COMMENT ROUTES
// =================

app.get("/index/:id/comments/new", isLoggedIn, function(req, res){
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

app.post("/index/:id/comments", function(req, res){
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
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/index/" + campground._id);
                }
            });
        }
    });
});    

// My solution
// app.post("/index/:id/comments", function(req, res){
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

//==============
//AUTH ROUTES
//==============
//show register form
app.get("/register", function(req, res){
    res.render("register");
});

//handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }        
        passport.authenticate("local")(req, res, function(){
            res.redirect("/index");
        });
    });
});
    
//show login form
app.get("/login", function(req, res){
    res.render("login");
});

//login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/index",
        failureRedirect: "/login"
    }), function(req, res){
});

//logout
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/index");
})

//middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        console.log("Loggedin");
        return next();
    }
    res.redirect("/login");
}

app.listen(3000, function(){
    console.log("The YelpCamp Server Has Started!");
});