(function () {
  'use strict';

  var auth = require('../../auth/auth.service');
  var permissions = require('../../config/permissions')
  var _ = require('lodash');
  var compose = require('composable-middleware');

  function hasPermission(key){
    return function (req, res, next){
      if(permissions[key].indexOf(req.user.Role.name) > -1) {
        next();
      } else {
        res.sendError(403, 'Not permitted to perform the requested operation.', 'Not permitted to perform the requested operation.');
      }
    }
  }

  function setMiddleware(key) {
    return compose()
      .use(auth.isAuthenticated())
      .use(hasPermission(key));
  }

  /**
   * Creates methods with the format canDoSomething
   * for every permission registered in the config
   * and returns a valid middleware that handles ROLE BASED ACCESS CONTROL
   */
  _.forOwn(permissions, function (roles, key) {
    exports['can' + key] = function () {
      return setMiddleware(key);
    }
  });

})();