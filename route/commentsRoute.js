const routes = require("express").Router();
const {
  addComments,
  FindPostComments,
} = require("../controller/comment.controller");
routes.post("/add", addComments);
routes.get("/read/:id", FindPostComments);
module.exports = routes;
