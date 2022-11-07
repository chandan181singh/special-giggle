const mongoose = require("mongoose");
const express = require('express');
mongoose.connect("mongodb://localhost:27017/UserDb10", {
    useNewUrlParser: "true"
});

const app = express();


//for user routes
const userRoute = require('./routes/userRoute');
app.use('/',userRoute);

app.listen(3000, () => {
    console.log('Server is up on port 3000');
});