require("dotenv").config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV;
const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;

module.exports = {
  CLIENT_URL,
  JWT_SECRET,
  MONGODB_URI,
  NODE_ENV,
  PORT,
  SESSION_SECRET,
};
