const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

let UserSchema = new mongoose.Schema({
    username: String,
    fullname: String,
    email: String,
    password: String,
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);