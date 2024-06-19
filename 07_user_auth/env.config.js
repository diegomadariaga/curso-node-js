import dotenv from 'dotenv'
dotenv.config()
export default {
  JWT_SECRET: process.env.JWT_SECRET,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  PORT: process.env.PORT
}
