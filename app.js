require('dotenv').config();

const express = require('express');
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const path = require('path');
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

// app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

//connect momgoose
mongoose.connect("mongodb://localhost:27017/UserDb", {
  useNewUrlParser: "true",
})
mongoose.connection.on("error", err => {
  console.log("err", err)
})
mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected")
})

const userSchema = new mongoose.Schema({
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true }
});

// const secret = "Thisisourlittlesecrete";
// userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

//connecting html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/register.html'));
});



//using the file present in the Present directory
app.use(express.static(__dirname));

app.post("/register", function (req, res) {

  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {

    const newUser = new User({
      email: req.body.username,
      password: hash
    });

    newUser.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.sendFile(path.join(__dirname, '/views/home.html'));
      }
    });
  })

});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function (err, result) {
          if (result === true) {
            res.sendFile(path.join(__dirname, '/views/home.html'));
          }
        });
      }
    }
  }
  )
});






//setting up our server
app.listen(3000, () => {
  console.log('Server is up on port 3000');
});