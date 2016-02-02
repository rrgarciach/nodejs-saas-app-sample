(function () {
  'use strict';

  var fs        = require('fs');
  var path      = require('path');
  var basename  = path.basename(module.filename);
  var env       = process.env.NODE_ENV || 'development';
  var sequelize = require('../components/db');
  var db        = {};

  fs
    .readdirSync(__dirname)
    .filter(function(file) {
      return (file.indexOf('.') !== 0) && (file !== basename);
    })
    .forEach(function(file) {
      var model = sequelize['import'](path.join(__dirname, file));
      db[model.name] = model;
    });

  Object.keys(db).forEach(function(modelName) {
    if ('associate' in db[modelName]) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;

  module.exports = db;

})();