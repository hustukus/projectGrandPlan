var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {type: Boolean, default: false},
    email: String,
    profilePic: String,
    userDescription: String,
    contributions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contribution"
        }
    ],
    createdGrandplans: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Grandplan"
        }
    ],
    contributedGrandplans: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Grandplan"
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);