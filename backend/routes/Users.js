// set up the express router //
const express = require("express");
const router = express.Router();

// get the users model from sequelize //
const { users } = require("../models");

// import bcrypt for hashing password
const bcrypt = require("bcrypt");

// USER REGISTRATION ROUTE //
router.post("/", async (req, res) => {
  try {
    // retrieve data
    const { username, password } = req.body;

    // hash the password using bcrypt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds); // generating the salt
    const bcryptPassword = await bcrypt.hash(password, salt); // hashing the password

    // let sequelize create the user
    await users.create({
      username,
      password: bcryptPassword,
    });

    res.status(201).json("SUCCESS");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// USER LOGIN ROUTE //
router.post("/login", async (req, res) => {
  try {
    // retrieve data
    const { username, password } = req.body;

    // check if user exists
    const user = await users.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "User does not exist" });
    }

    //
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    res.status(200).json({ message: "You have successfully logged in" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to login user" });
  }
});

module.exports = router;
