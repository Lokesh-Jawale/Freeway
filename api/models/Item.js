const mongoose = require("mongoose")

const ItemSchema = mongoose.Schema({
    donatedBy: {
        type: String,
        required: true
    },
    title: {
        type: String,
        max: 300,
    },
    description:{
        type:String,
        max:500,
    },
    image: {
        type: String,
    },
    condition: {
        type: String,
    },
    category: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },    
    country: {
        type: String,
    },
},
{timestamps: true}
);

module.exports = mongoose.model("Item", ItemSchema);
