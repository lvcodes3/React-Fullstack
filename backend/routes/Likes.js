// set up the express router //
const express = require("express");
const router = express.Router();

// get the likes model from sequelize //
const { likes } = require("../models");

// middleware to validate the jwt //
const { validateJWT } = require("../middlewares/AuthMiddleware");

////////////////////
// LIKE OR UNLIKE //
////////////////////
router.post("/", validateJWT, async (req, res) => {
  try {
    // retrieve data
    const { postId } = req.body;

    // retrieve id from the validateJWT middleware
    const userId = req.user.id;

    // see if like already exists
    const likeExists = await likes.findOne({
      where: { postId: postId, userId: userId },
    });

    if (!likeExists) {
      // let sequelize create the like with the provided data
      await likes.create({ postId: postId, userId: userId });
      return res.sendStatus(201);
    } else {
      // let sequelize delete the delete
      await likes.destroy({
        where: { postId: postId, userId: userId },
      });
      return res.sendStatus(204);
    }
  } catch (err) {
    console.error(`Error creating like: ${err}`);
    return res.status(500).json({ error: "Error creating like." });
  }
});

module.exports = router;
