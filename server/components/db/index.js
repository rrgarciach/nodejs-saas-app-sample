(function () {
  'use strict';

  var config = require('../../config/environment');
  var dbConfig = config.db;
  var Sequelize = require('sequelize');
  var sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

  module.exports = sequelize;

})();