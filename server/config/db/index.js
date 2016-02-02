(function () {
  module.exports = {
    development: {
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      host: process.env.MYSQL_HOST,
      dialect: "mysql",
      port: 3306,
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      }
    },
    "test": {
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      host: process.env.MYSQL_HOST,
      dialect: "mysql",
      port: 3306,
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      }
    },
    "production": {
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      host: process.env.MYSQL_HOST,
      dialect: "mysql",
      port: 3306,
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      }
    }
  };

})();
