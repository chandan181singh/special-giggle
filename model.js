const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

//const User = new Schema({});

const User = new Schema({
    name: String,
    email: String, 
    password: String
},{ sparse: true });

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);