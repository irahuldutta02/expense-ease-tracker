require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV;
const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;
const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = process.env.EMAIL_PORT;
const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const CLIENT_URL = process.env.CLIENT_URL;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

module.exports = {
  JWT_SECRET,
  MONGODB_URI,
  NODE_ENV,
  PORT,
  SESSION_SECRET,
  EMAIL_HOST,
  EMAIL_PASSWORD,
  EMAIL_PORT,
  EMAIL_USERNAME,
  CLIENT_URL,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_FOLDER,
  GOOGLE_API_KEY,
};
