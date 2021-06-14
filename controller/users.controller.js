const users = require("../model/users");
const createError = require("http-errors");
const hashPassord = require("bcrypt");
const jwt = require("jsonwebtoken");
const { json } = require("express");
const { findByIdAndUpdate } = require("../model/users");
const date = new Date();
const addUser = async (req, res, next) => {
  try {
    let username = req.body.fullname;
    const checkEmail = await users.find({ email: req.body.email });
    const checkUser = await users.find({ username: username });
    if (
      req.body.fullname == "" ||
      req.body.email == "" ||
      req.body.password == ""
    ) {
      next(createError(404, "error data is emapty ", { code: 400 }));
    } else if (checkEmail.length > 0) {
      next(createError(404, "email elraedy exits ", { code: 401 }));
    } else if (checkUser.length > 0) {
      next(createError(404, "username elraedy exits ", { code: 402 }));
    } else {
      hashPassord.hash(req.body.password, 10, async (err, hash) => {
        if (err) {
          next(createError(404, "error hash password ", { code: 403 }));
        } else {
          const add = await users({
            fullname: req.body.fullname,
            username: username,
            email: req.body.email,
            password: hash,
            country: req.body.country,
            ip: "123.3.3",
            type: "free",
            status: "1",
            datecreate: date,
            follow: 0,
            allvideos: 0,
            allviews: 0,
            following: 0,
          }).save();
          res.json({
            code: 200,
            message: "successfully add user",
          });
        }
      });
    }
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  try {
    const checkAuth = await users.find({ email: req.body.email });
    if (checkAuth.length > 0) {
      hashPassord.compare(
        req.body.password,
        checkAuth[0].password,
        async (err, result) => {
          if (err) {
            next(
              createError(404, "error login password is invalid", { code: 402 })
            );
          }
          if (result) {
            const token = jwt.sign(
              { email: checkAuth[0].email, username: checkAuth[0].username },
              "arabest_fad",
              {
                expiresIn: 864000,
              }
            );
            return res.json({
              code: 200,
              message: "succefully  login",
              user: {
                username: checkAuth[0].username,
                fullname: checkAuth[0].fullname,
                email: checkAuth[0].email,
                id: checkAuth[0]._id,
                isAdmin: checkAuth[0].isAdmin,
              },
              token: token,
            });
          } else {
            next(createError(404, "error login ", { code: 403 }));
          }
        }
      );
    } else {
      next(
        createError(404, "error login invalid email or password", { code: 404 })
      );
    }
  } catch (error) {
    next(error);
  }
};
const updateUser = async (req, res, next) => {
  try {
    if (req.body.id != req.user._id) {
      throw createError(404, "error permission", { code: 403 });
    }
    const fiterUser = { _id: req.user._id };
    const update = { fullname: req.body.fullname };
    if (req.body.fullname != "") {
      const updatUs = await users.findByIdAndUpdate(fiterUser, update);
      res.json({
        message: "succefully updated",
      });
    } else {
      throw createError(404, "error name is empty", { code: 404 });
    }
  } catch (error) {
    next(error.message);
  }
};
module.exports = { addUser, login, updateUser };
