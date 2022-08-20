const { Schema, model } = require("mongoose");

const restaurantSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, ref: "User"
    },
    name: {
        type: String,
        required: [true, "Must include name"]
    },
    cuisine: {
        type: String,
        required: [true, "Please select a cuisine"]
    },
    reviews: [{
        type: Schema.Types.ObjectId, ref: "Review"
    }]}
    , {minimize: false});

const Restaurant = model('Restaurant', restaurantSchema);

module.exports = Restaurant
