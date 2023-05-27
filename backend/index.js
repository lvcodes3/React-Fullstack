// create express web server
const express = require("express");
const app = express();

// import middlewares
const cors = require("cors"); // allow communication between frontend and backend
const morgan = require("morgan"); // HTTP request logger middleware for node.js

// require env variables
require("dotenv").config();
// access port number from env variable
const PORT = process.env.PORT;

// use middlewares //
app.use(express.json()); // express middleware that gives us access to JSON data in req.body
app.use(cors());
app.use(morgan("tiny"));

const db = require("./models");
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Express Server Running on Port ${PORT}`);
  });
});
