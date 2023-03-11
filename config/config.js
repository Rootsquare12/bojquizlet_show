require('dotenv').config();

module.exports = {
    development: {
      username: "root",
      password: process.env.SEQUELIZE_PASSWORD,
      database: "bojquizlet",
      host: "127.0.0.1",
      dialect: "mysql",
      timezone: "+09:00"
    },
    test: {
      username: "root",
      password: process.env.SEQUELIZE_PASSWORD,
      database: "bojquizlet",
      host: "127.0.0.1",
      dialect: "mysql",
      timezone: "+09:00"
    },
    production: {
      username: "root",
      password: process.env.SEQUELIZE_PASSWORD,
      database: "bojquizlet",
      host: "127.0.0.1",
      dialect: "mysql",
      logging: false,
      timezone: "+09:00"
    }
  }
  