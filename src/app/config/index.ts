import dotenv from "dotenv";

dotenv.config();

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  client_url: process.env.CLIENT_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  default_password: process.env.DEFAULT_PASSWORD,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_reset_secret: process.env.JWT_RESET_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  sendgrid_api_key: process.env.SENDGRID_API_KEY,
  sendgrid_email: process.env.SENDGRID_EMAIL,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};
