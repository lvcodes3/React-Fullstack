// jwt for authentication //
const { verify } = require("jsonwebtoken");

// allow use of env variables //
require("dotenv").config();

const validateJWT = (req, res, next) => {
  try {
    // get the jwt from the header
    const jwt = req.header("jwt");

    // check that the jwt exists
    if (!jwt) {
      // 403 = Forbidden
      return res.status(403).json({ error: "Access forbidden." });
    }

    // verify the jwt
    const isValidJWT = verify(jwt, process.env.JWT_SECRET);

    if (isValidJWT) {
      // storing data from jwt: id, username
      req.user = isValidJWT;
      return next();
    }
  } catch (err) {
    console.log(`Error validating JWT: ${err}`);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

module.exports = { validateJWT };
