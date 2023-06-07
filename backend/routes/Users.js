// set up the express router //
const express = require("express");
const router = express.Router();

// bcrypt for authentication //
const bcrypt = require("bcrypt");

// jwt for authentication //
const { sign } = require("jsonwebtoken");

// middleware to validate the jwt //
const { validateJWT } = require("../middlewares/AuthMiddleware");

// allow use of env variables //
require("dotenv").config();

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
    const newUser = await users.create({
      username,
      password: bcryptPassword,
    });

    // return response
    return res.status(201).json(newUser);
  } catch (err) {
    console.log(`Error registering: ${err}`);
    return res.status(500).json({ error: "Error registering." });
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
        .json({ error: "Username and / or password is incorrect." });
    }

    // ensure password is correct
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ error: "Username and / or password is incorrect." });
    }

    // generate JWT
    const jwt = sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET
    );

    // return JWT response with username and id
    return res.status(200).json({
      jwt,
      id: user.id,
      username: user.username,
    });
  } catch (err) {
    console.log(`Error logging in: ${err}`);
    return res.status(500).json({ error: "Error logging in." });
  }
});

//////////////////////////
// JWT VALIDATION ROUTE //
//////////////////////////
router.get("/", validateJWT, (req, res) => {
  return res.status(200).json(req.user);
});

module.exports = router;
