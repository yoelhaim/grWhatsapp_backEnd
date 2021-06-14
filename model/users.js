const mongoose = require("mongoose");
const users = mongoose.Schema({
  fullname: String,
  username: String,
  email: String,
  password: String,
  country: String,
  ip: String,
  type: String,
  status: {
    type: Number,
    required: true,
    default: 0,
  },
  datecreate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  follow: Number,
  allvideos: Number,
  allviews: Number,
  following: Number,
  isAdmin: {
    type: String,
    required: true,
    default: "0",
  },
});
module.exports = mongoose.model("USERS", users);
