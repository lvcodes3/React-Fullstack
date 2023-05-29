// set up the express router //
const express = require("express");
const router = express.Router();

// get the posts model from sequelize //
const { posts } = require("../models");

router.get("/", async (req, res) => {
  // let sequelize retrieve all posts
  const listOfPosts = await posts.findAll();
  res.json(listOfPosts);
});

router.get("/:id", async (req, res) => {
  // get the passed in id
  const id = req.params.id;

  // let sequelize retrieve the post by id
  const post = await posts.findByPk(id);

  // return the post
  res.json(post);
});

router.post("/", async (req, res) => {
  // retrieve data
  const post = req.body;

  // let sequelize create the post with the provided data
  await posts.create(post);

  // return the post
  res.json(post);
});

module.exports = router;
