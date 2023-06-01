// set up the express router //
const express = require("express");
const router = express.Router();

// get the posts model from sequelize //
const { posts } = require("../models");

// GET ALL POSTS ROUTE //
router.get("/", async (req, res) => {
  try {
    // let sequelize retrieve all posts
    const listOfPosts = await posts.findAll();

    //return posts
    res.status(200).json(listOfPosts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to get all posts." });
  }
});

// GET POST BY ID ROUTE //
router.get("/:id", async (req, res) => {
  try {
    // get the passed in id
    const id = req.params.id;

    // let sequelize retrieve the post by id
    const post = await posts.findByPk(id);

    // return post
    res.status(200).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to get post." });
  }
});

// CREATE POST ROUTE //
router.post("/", async (req, res) => {
  try {
    // retrieve data
    const post = req.body;

    // let sequelize create the post with the provided data
    await posts.create(post);

    // return post
    res.status(201).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create post." });
  }
});

module.exports = router;
