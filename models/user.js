const mongoose = require('mongoose')
const Schema = mongoose.Schema

var userSchema = new Schema({
    username: String,
    password: String,
    avatar: String,
    firstName: String,
    lastName: String,
    email: {type: String, unique: true, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: {type: Boolean, default: false}
});

//userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);