const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GallerySchema = new Schema({
    title: {
        type: String,
        default: ""
    },
    user_id: {
        type: String,
        default: ""
    },
    pictures: []
})

module.exports = mongoose.model("Gallery", GallerySchema);
