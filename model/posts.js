const mongoose = require("mongoose");
const Posts = mongoose.Schema({
  title: String,
  link: String,
  desc: String,
  views: { type: Number, required: true, default: 0 },
  desc: { type: String, required: true, default: "no " },
  datecreate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: Boolean,
    required: true,
    default: false,
  },
  catagory: String,
  urlpost: String,
  imagepost: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  type: String,
});
module.exports = mongoose.model("POST", Posts);
