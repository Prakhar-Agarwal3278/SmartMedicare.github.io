var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
    username:String,
    password:String
});

// Takeour passport local mongoose package and brings method to userSchema like come with it
UserSchema.plugin(passportLocalMongoose); 


module.exports = mongoose.model("User", UserSchema);


