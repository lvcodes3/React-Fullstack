// set up the express router //
const express = require("express");
const router = express.Router();

// get the posts model from sequelize //
const { comments } = require("../models");

// middleware to validate the jwt
const { validateToken } = require("../middlewares/AuthMiddleware");

// GET COMMENTS BY POSTID ROUTE //
router.get("/:postId", async (req, res) => {
  try {
    // get the passed in postId
    const postId = req.params.postId;

    // let sequelize retrieve the comments by postId
    const commentsByPostId = await comments.findAll({ where: { postId } });

    // return comments
    res.status(200).json(commentsByPostId);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to get all comments by postId." });
  }
});

// CREATE COMMENT ROUTE //
router.post("/", validateToken, async (req, res) => {
  try {
    // retrieve data
    const comment = req.body;

    // let sequelize create the comment with the provided data
    const createdComment = await comments.create(comment);

    // return the created comment from the db
    res.status(201).json(createdComment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
