var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var roomsSchema = new Schema({
  groupname: {
    type: String,
    default: "",
    trim: true
  },
  avatarletter: {
    type: String,
    default: "",
    trim: true
  },
  admin_id: {
    type: String,
    default: ""
  },
  created_on: {
    type: String,
    default: ""
  },

  conversation: [
    {
      from: String,
      message: String,
      favourite: Boolean,
      time: { type : Date, default : Date.now },
      picture: String
    }
  ],
  notes: [
    {
      from: String,
      text: String,
      date: String,
      time: String
    }
  ],
  participants: [{}],
  remainparticipants: [{}]
});

module.exports = mongoose.model("rooms", roomsSchema);
