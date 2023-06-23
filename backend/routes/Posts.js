// set up the express router //
const express = require("express");
const router = express.Router();

// get the posts model from sequelize //
const { posts, likes, comments } = require("../models");

// middleware to validate the jwt //
const { validateJWT } = require("../middlewares/AuthMiddleware");

///////////////////
// GET ALL POSTS //
///////////////////
router.get("/", validateJWT, async (req, res) => {
  try {
    // let sequelize retrieve all posts, including the associated likes and comments
    // and sorts the posts in ascending order based on their id
    const listOfPosts = await posts.findAll({
      include: [likes, comments],
      order: [["id", "ASC"]],
    });

    // let sequelize retrive all the likes made by the current logged in user
    const likedPosts = await likes.findAll({
      where: { userId: req.user.id },
    });

    return res.status(200).json({
      listOfPosts: listOfPosts,
      likedPosts: likedPosts,
    });
  } catch (err) {
    console.error(`Error getting all posts: ${err}`);
    return res.status(500).json({ error: "Error getting all posts." });
  }
});

////////////////////
// GET POST BY ID //
////////////////////
router.get("/byId/:id", validateJWT, async (req, res) => {
  try {
    // get the passed in id
    const id = req.params.id;

    // let sequelize retrieve post owned by id including the associated likes
    // and sorts the posts in ascending order based on their id
    const post = await posts.findByPk(id, {
      include: [likes],
    });

    // let sequelize retrive all the likes made by the current logged in user
    const likedPosts = await likes.findAll({
      where: { userId: req.user.id },
    });

    // return post and likes
    return res.status(200).json({
      post: post,
      likedPosts: likedPosts,
    });
  } catch (err) {
    console.error(`Error getting post by id: ${err}`);
    return res.status(500).json({ error: "Error getting post by id." });
  }
});

/////////////////////////
// GET POSTS BY USERID //
/////////////////////////
router.get("/byUserId/:id", validateJWT, async (req, res) => {
  try {
    // get the passed in id
    const userId = req.params.id;

    // let sequelize retrieve all posts owned by userId, including the associated likes
    // and comments and sorts the posts in ascending order based on their id
    const listOfPosts = await posts.findAll({
      where: { userId: userId },
      include: [likes, comments],
      order: [["id", "ASC"]],
    });

    // let sequelize retrive all the likes made by the current logged in user
    const likedPosts = await likes.findAll({
      where: { userId: req.user.id },
    });

    // return posts and likes
    return res.status(200).json({
      listOfPosts: listOfPosts,
      likedPosts: likedPosts,
    });
  } catch (err) {
    console.error(`Error getting post by userId: ${err}`);
    return res.status(500).json({ error: "Error getting post by userId." });
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

/////////////////
// DELETE POST //
/////////////////
router.delete("/:postId", validateJWT, async (req, res) => {
  try {
    const postId = req.params.postId;

    await posts.destroy({ where: { id: postId } });

    return res.sendStatus(204);
  } catch (err) {
    console.error(`Error deleting post: ${err}`);
    return res.status(500).json({ error: "Error deleting post." });
  }
});

module.exports = router;
