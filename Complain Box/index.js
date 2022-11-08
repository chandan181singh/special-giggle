const mongoose = require("mongoose");
const express = require('express');
mongoose.connect("mongodb://localhost:27017/UserDb10", {
    useNewUrlParser: "true"
});

const app = express();
app.use(express.static(__dirname));

//for user routes
const userRoute = require('./routes/userRoute');
app.use('/',userRoute);

//for admin routes
const adminRoute = require('./routes/adminRoute');
app.use('/adminlogin',adminRoute);

app.listen(3000, () => {
    console.log('Server is up on port 3000');
});