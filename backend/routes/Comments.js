// set up the express router //
const express = require("express");
const router = express.Router();

// get the posts model from sequelize //
const { comments } = require("../models");

router.get("/:postId", async (req, res) => {
  try {
    // get the passed in postId
    const postId = req.params.postId;

    // let sequelize retrieve the comments by postId
    const commentsByPostId = await comments.findAll({ where: { postId } });

    // return the comments
    res.json(commentsByPostId);
  } catch (err) {
    console.log(err);
  }
});

router.post("/", async (req, res) => {
  try {
    // retrieve data
    const comment = req.body;

    // let sequelize create the comment with the provided data
    const createdComment = await comments.create(comment);

    // return the created comment from the db
    res.status(201).json(createdComment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

module.exports = router;
