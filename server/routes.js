/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');
var cors = require('cors');

module.exports = function(app) {

  // Activate CORS (to enable connectivity with mobile Apps)
  app.use(cors());
  // Insert routes below
  //app.use('/auth', require('./auth'));
  app.use('/api/v1/auth', require('./auth'));
  //app.use('/api/users', require('./api/user'));
  app.use('/api/v1/users', require('./api/user'));
  app.use('/api/v1/things', require('./api/thing'));
  app.use('/api/v1/promoters', require('./api/promoter'));
  app.use('/api/v1/clients', require('./api/client'));
  app.use('/api/v1/products', require('./api/product'));
  app.use('/api/v1/orders', require('./api/order'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
