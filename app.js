var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    flash = require("connect-flash"),
    localStrategy = require("passport-local"),
    session = require("express-session"),
    cookieParser = require('cookie-parser'),
    MongoStore = require("connect-mongo")(session),
    
    Product = require("./models/Product.js"),
    User = require("./models/user.js"),
    Review = require("./models/review");

//REQUIRING ROUTES
var indexRouter = require("./routes/index.js"),
    userRouter = require("./routes/user.js"),
    adminRouter = require("./routes/admin.js")
    
//Database connection
mongoose.connect("mongodb://localhost/bliss", {useNewUrlParser: true});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(flash());


//PASSPORT CONFIGURATION
app.use(session({
    secret: "no tale fairy, all real very, extra ordinary",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Passing middleware to all templates
app.use(function(req, res, next){
    req.app.locals.currentUser = req.user;
    req.app.locals.error = req.flash("error");
    req.app.locals.success = req.flash("success");
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});



app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Your app is served!");
});