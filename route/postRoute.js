const routes = require("express").Router();
const {
  addPost,
  FindAllPost,
  FindOnePost,
  updatePost,
  updatePrivacy,
  getByuser,
} = require("../controller/post.controller.js");

routes.post("/add", addPost);
routes.get("/all/:user?", FindAllPost);
routes.get("/watch/:id", FindOnePost);
routes.put("/update", updatePost);
routes.put("/privacy", updatePrivacy);
routes.get("/videos/:user?", getByuser);

module.exports = routes;
