const express = require('express');
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const path = require('path');
const app = express();
  

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

//connecting html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

//using the file present in the Present directory
app.use(express.static(__dirname));
  
//setting up our server
app.listen(3000, () => {
  console.log('Server is up on port 3000');
});