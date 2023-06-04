// jwt for authentication
const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  // obtain jwt
  const accessToken = req.header("accessToken");

  // check that accessToken exists
  if (!accessToken)
    return res.status(401).json({ error: "User is not logged in." });

  // verify accessToken
  try {
    const validToken = verify(accessToken, "importantsecret");

    if (validToken) {
      return next();
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

module.exports = { validateToken };
