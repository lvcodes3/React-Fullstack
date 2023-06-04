// set up the express router //
const express = require("express");
const router = express.Router();

// bcrypt for authentication //
const bcrypt = require("bcrypt");

// jwt for authentication
const { sign } = require("jsonwebtoken");

// get the users model from sequelize //
const { users } = require("../models");

////////////////////
// REGISTER ROUTE //
////////////////////
router.post("/register", async (req, res) => {
  try {
    // retrieve data
    const { username, password } = req.body;

    // ensure username is unique
    const user = await users.findOne({ where: { username } });
    if (user) {
      return res.status(401).json({ error: "Username already exists." });
    }

    // hash the password using bcrypt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds); // generating the salt
    const bcryptPassword = await bcrypt.hash(password, salt); // hashing the password

    // let sequelize create the user
    await users.create({
      username,
      password: bcryptPassword,
    });

    // return response
    return res
      .status(201)
      .json({ message: "You have successfully registered." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to create user." });
  }
});

/////////////////
// LOGIN ROUTE //
/////////////////
router.post("/login", async (req, res) => {
  try {
    // retrieve data
    const { username, password } = req.body;

    // ensure user exists
    const user = await users.findOne({ where: { username } });
    if (!user) {
      return res
        .status(401)
        .json({ error: "Username or password is incorrect." });
    }

    // ensure password is correct
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ error: "Username or password is incorrect." });
    }

    // generate JWT
    const jwt = sign(
      { id: user.id, username: user.username },
      "secretcodeforjwt"
    );

    // return JWT response
    return res.status(200).json(jwt);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to login user." });
  }
});

module.exports = router;
