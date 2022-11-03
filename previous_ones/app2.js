require('dotenv').config();

const express = require('express');
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const path = require('path');
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(session({
    secret: "Our litle secret.",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());



// app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

//connect momgoose
mongoose.connect("mongodb://localhost:27017/UserDb2", {
    useNewUrlParser: "true",
})
// mongoose.set("useCreateIndex", true);

mongoose.connection.on("error", err => {
    console.log("err", err)
})
mongoose.connection.on("connected", (err, res) => {
    console.log("mongoose is connected")
})

// const userSchema = new mongoose.Schema({
//     email: { type: String, require: true, unique: true },
//     password: { type: String, require: true }
// });

const userSchema = new mongoose.Schema({
    email: String, 
    password: String
});


userSchema.plugin(passportLocalMongoose);

//creating new mongoose schema
const User = new mongoose.model("User", userSchema);


passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//connecting html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/login.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/register.html'));
});

app.get('/secrets', (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile(path.join(__dirname, '/views/home.html'));
    } else {
        res.redirect("/login");
    }

});


app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { 
        return next(err); 
        }
      res.redirect('/');
    });
  });


//using the file present in the Present directory
app.use(express.static(__dirname));




app.post("/register", function (req, res) {

    User.register({username: req.body.username}, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
           
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            });
        }
    });
});

app.post("/login", function (req, res) {

    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err){
        if(err){
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            });
        }
    });
});


//setting up our server
app.listen(3000, () => {
    console.log('Server is up on port 3000');
});