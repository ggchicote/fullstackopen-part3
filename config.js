require('dotenv').config()

const config = {
  db: {
    uri:process.env.MONGODB_URI
  },
  port: process.env.PORT
}

module.exports = config