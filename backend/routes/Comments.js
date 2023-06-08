// set up the express router //
const express = require("express");
const router = express.Router();

// get the posts model from sequelize //
const { comments } = require("../models");

// middleware to validate the jwt //
const { validateJWT } = require("../middlewares/AuthMiddleware");

////////////////////////////
// GET COMMENTS BY POSTID //
////////////////////////////
router.get("/:postId", validateJWT, async (req, res) => {
  try {
    // get the passed in postId
    const postId = req.params.postId;

    // let sequelize retrieve the comments by postId
    const commentsByPostId = await comments.findAll({ where: { postId } });

    // return comments
    return res.status(200).json(commentsByPostId);
  } catch (err) {
    console.error(`Error getting all comments by postId: ${err}`);
    return res
      .status(500)
      .json({ error: "Error getting all comments by postId." });
  }
});

////////////////////
// CREATE COMMENT //
////////////////////
router.post("/", validateJWT, async (req, res) => {
  try {
    // retrieve data (passed in as obj)
    const comment = req.body;

    // retrieve username from the validateJWT middleware
    const username = req.user.username;

    // adding the username to the comment obj
    comment.username = username;

    // let sequelize create the comment
    const createdComment = await comments.create(comment);

    // return the created comment from the db
    return res.status(201).json(createdComment);
  } catch (err) {
    console.error(`Error creating comment: ${err}`);
    return res.status(500).json({ error: "Error creating comment." });
  }
});

////////////////////
// DELETE COMMENT //
////////////////////
router.delete("/:commentId", validateJWT, async (req, res) => {
  try {
    const commentId = parseInt(req.params.commentId);

    await comments.destroy({ where: { id: commentId } });

    return res.sendStatus(204);
  } catch (err) {
    console.error(`Error deleting comment: ${err}`);
    return res.status(500).json({ error: "Error deleting comment." });
  }
});

module.exports = router;
