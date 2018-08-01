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
    pictures: [],
    isActive: {type: Boolean, default: true}
})

module.exports = mongoose.model("Gallery", GallerySchema);
