var mongoose = require("mongoose");
var moment = require("moment");
var currentDate = moment();
currentDate.format("YYYY-MM-DD");

// GRANDPLAN
//mongoose schema setup
var grandplanSchema = new mongoose.Schema({
    name: String,
    reqContr: String, //number of required contributors, or more like a list of users, which is then converted to an amount when needed
    actContr: String, //number of actual contributors now present, or more like a list of users, which is then converted to an amount when needed
    image: String,
    description: String,
    createdAt: {type: Date, default: currentDate },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    contributions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contribution"
        }
    ]
});


module.exports = mongoose.model("Grandplan", grandplanSchema);