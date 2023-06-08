// set up the express router //
const express = require("express");
const router = express.Router();

// get the posts model from sequelize //
const { posts } = require("../models");

// middleware to validate the jwt //
const { validateJWT } = require("../middlewares/AuthMiddleware");

///////////////////
// GET ALL POSTS //
///////////////////
router.get("/", validateJWT, async (req, res) => {
  try {
    // let sequelize retrieve all posts
    const listOfPosts = await posts.findAll();

    //return posts
    return res.status(200).json(listOfPosts);
  } catch (err) {
    console.error(`Error getting all posts: ${err}`);
    return res.status(500).json({ error: "Error getting all posts." });
  }
});

////////////////////
// GET POST BY ID //
////////////////////
router.get("/:id", validateJWT, async (req, res) => {
  try {
    // get the passed in id
    const id = req.params.id;

    // let sequelize retrieve the post by id
    const post = await posts.findByPk(id);

    // return post
    return res.status(200).json(post);
  } catch (err) {
    console.error(`Error getting post by id: ${err}`);
    return res.status(500).json({ error: "Error getting post by id." });
  }
});

/////////////////
// CREATE POST //
/////////////////
router.post("/", validateJWT, async (req, res) => {
  try {
    // retrieve data
    const post = req.body;

    // retrieve username from the validateJWT middleware
    const username = req.user.username;
    // retrieve id from the validateJWT middleware
    const id = req.user.id;

    // adding the username to the post obj
    post.username = username;
    // adding the id to the post obj
    post.userId = id;

    // let sequelize create the post with the provided data
    await posts.create(post);

    // return post
    return res.status(201).json(post);
  } catch (err) {
    console.error(`Error creating post: ${err}`);
    return res.status(500).json({ error: "Error creating post." });
  }
});

module.exports = router;
