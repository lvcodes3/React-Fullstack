// create express web server //
const express = require("express");
const app = express();

// import middlewares //
const cors = require("cors");
const morgan = require("morgan");

// import Routes //
const postsRouter = require("./routes/Posts");
const commentsRouter = require("./routes/Comments");
const usersRouter = require("./routes/Users");

// require and use env variables //
require("dotenv").config();
const PORT = process.env.PORT;

// use middlewares //
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

// Main Routes //
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/auth", usersRouter);

const db = require("./models");
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Express Server Running on Port ${PORT}`);
  });
});
