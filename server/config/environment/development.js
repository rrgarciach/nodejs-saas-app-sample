(function () {
  'use strict';
  var dbConfig = require('../db').development;

  // Development specific configuration
  // ==================================
  module.exports = {
    // MongoDB connection options
    mongo: {
      uri: 'mongodb://localhost/saas-dev'
    },
    seedDB: false,

    db: dbConfig,
    debug: true,
    host: 'localhost:9090'
  };

})();
