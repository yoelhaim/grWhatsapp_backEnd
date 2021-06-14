const routes = require("express").Router();
const {
  addUser,
  login,
  updateUser,
} = require("../controller/users.controller");

routes.post("/add", addUser);
routes.post("/login", login);
routes.put("/update", updateUser);

module.exports = routes;
