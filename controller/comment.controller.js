const commentsModel = require("../model/comments");
const createError = require("http-errors");
const date = require("../config/date");

const addComments = async (req, res, next) => {
  try {
    if (req.body.userId != req.user._id) {
      throw createError.Forbidden("error permission");
    }
    if (req.body.text == "" || req.body.userId == "") {
      throw createError.Forbidden("error is emty text");
    }
    const post = await new commentsModel({
      text: req.body.text,
      userId: req.user._id,
      postId: req.body.postId,
      username_u: req.body.username_u,
      type: true,
    }).save();
    res.json({
      message: "success",
      post,
    });
  } catch (error) {
    next(error);
  }
};
const FindPostComments = async (req, res, next) => {
  const commenysPosts = await commentsModel
    .find({ postId: req.params.id })
    .sort([["_id", "ascending"]])
    .limit(40);
  res.send(commenysPosts);
};
module.exports = { addComments, FindPostComments };
