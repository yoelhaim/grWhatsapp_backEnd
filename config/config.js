require("dotenv").config();
module.exports = {
  development: {
    Port: process.env.DB_PORT,
    User: process.env.DB_USER,
    Pass: process.env.DB_PASS,
    Name: process.env.DB_NAME,

    logging: false,
  },
};
