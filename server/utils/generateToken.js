const jwt = require("jsonwebtoken");
const { JWT_SECRET, NODE_ENV } = require("../config/server.config.js");

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "30d",
  });

  return token;
};

module.exports = generateToken;
