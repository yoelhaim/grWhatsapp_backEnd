const jwt = require("jsonwebtoken");
const users = require("../model/users");
const createError = require("http-errors");
module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, "arabest_fad");
    email = decode.email;
    const user = await users.findOne({ email: email });
    req.user = user;
    next();
  } catch (error) {
    next(createError.Forbidden("token expired"));
  }
};
