const mongoose = require("mongoose");
const comments = mongoose.Schema({
  text: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  postId: {
    type: String,
  },
  username_u: {
    type: String,
    required: true,
    default: "0",
  },
  dateCreate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  type: Boolean,
});
module.exports = mongoose.model("COMMENT", comments);
