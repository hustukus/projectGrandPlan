var mongoose = require("mongoose");
var moment = require("moment");
var currentDate = moment();
currentDate.format("YYYY-MM-DD");

// mongoose schema-setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String, //this could be change d for e.g. the owner of the idea
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

module.exports = mongoose.model("Campground", campgroundSchema);