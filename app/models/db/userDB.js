var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    user: {
        phone: String,
        lineId: String
    }
}, {
    strict: false
});

userSchema.index({ "user.lineId": 1 });

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);