var mongoose = require("mongoose");

// mongoose schema-setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String, //this could be change d for e.g. the owner of the idea
    image: String,
    description: String,
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
    ]
});

module.exports = mongoose.model("Campground", campgroundSchema);