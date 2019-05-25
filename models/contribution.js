var mongoose = require("mongoose");

// CONTRIBUTION
//mongoose schema setup
var contributionSchema = new mongoose.Schema({
    role: String,
    message: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});


module.exports = mongoose.model("Contribution", contributionSchema);