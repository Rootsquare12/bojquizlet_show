require('dotenv').config();

module.exports = {
    development: {
      username: "root",
      password: process.env.SEQUELIZE_PASSWORD,
      database: "bojquizlet",
      host: "127.0.0.1",
      dialect: "mysql",
      timezone: "Asia/Seoul"
    },
    test: {
      username: "root",
      password: process.env.SEQUELIZE_PASSWORD,
      database: "bojquizlet_test",
      host: "127.0.0.1",
      dialect: "mysql",
      timezone: "Asia/Seoul"
    },
    production: {
      username: "root",
      password: process.env.SEQUELIZE_PASSWORD,
      database: "bojquizlet",
      host: "127.0.0.1",
      dialect: "mysql",
      logging: false,
      timezone: "Asia/Seoul"
    }
  }
  