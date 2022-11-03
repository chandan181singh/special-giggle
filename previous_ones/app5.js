require('dotenv').config();

const express = require('express');
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const path = require('path');
const session = require('express-session');
const passport = require("passport");
const alert = require("alert"); 
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = require('./models/user');

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


userSchema.plugin(passportLocalMongoose);

//creating new mongoose schema
const User = new mongoose.model("User", userSchema);

//connect momgoose
mongoose.connect("mongodb://localhost:27017/UserDb2", {
    useNewUrlParser: "true",
})
//mongoose.set("useCreateIndex", true);

mongoose.connection.on("error", err => {
    console.log("err", err)
})
mongoose.connection.on("connected", (err, res) => {
    console.log("mongoose is connected")
})


passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//connecting html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/userlogin.html'));
});

app.get('/userlogin', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/userlogin.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/register.html'));
});

app.get('/secrets', (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile(path.join(__dirname, '/views/home3.html'));
    } else {
        res.redirect("/userlogin");
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

    const { password, password2} = req.body; 
    // let errors = [];
     let count = 0;
    if (password !== password2) {
        alert("Passwords do not match");
        count++;
    }
    //Check password length
    if (password.length < 6) {
        alert("Password should be at least 6 characters");
        count++;
    }
    if(count>0) console.log("error = "+ count);
   

    User.register({username: req.body.username},req.body.name, req.body.password, function (err, user) {
        if (err || count > 0) {
            console.log(err);
           
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            });
        }
    });
    
});

app.post("/userlogin", function (req, res) {

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